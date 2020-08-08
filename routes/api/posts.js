const express = require('express');
const router = require('express').Router();
const {check,validationResult}=require("express-validator/check");
const mongoose=require("mongoose");
const Post=require("../../models/Post");
const User=require("../../models/User");
const Profile=require("../../models/Profile");
const auth=require("../../middleware/auth");


//@route POST api/posts
//@desc Add Post
//@access Private

router.post('/', [auth,
   [check("text","Text is required").not().isEmpty()] 
],
async (req, res) => {
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json(errors.array());
    }
    try
    {
        const user1= await User.findById(req.user.id).select("-password");
        const newpost=new Post(
        {
            text:req.body.text,
            user:req.user.id,
            name:user1.name,
            avatar:user1.avatar

        });
        const post=await newpost.save();
        res.json(post);


    }catch(err)
    {
        console.log(err.message);
        res.status(500).send("Server error");
    }

});

//@route GET api/posts
//@desc View all posts
//@access Public

router.get("/",async (req,res)=>
{
    try {
        const posts= await Post.find().sort({date:-1});
        res.json(posts);

        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
        
    }
});
//@route GET api/posts/:postid
//@desc Get post by id
//@access Public
router.get("/:postid", async (req,res)=>{

    try {
        const post= await Post.findById(req.params.postid);
        if(!post)
        {
            return res.status(400).json({msg:"Post not found"});
        }
        res.json(post);
        
    } catch (error) {
        console.log(error.message);
        if(error.kind==="ObjectId")
        return res.status(404).json({msg:"Post not found"});
        res.status(500).send("Server error");
    }

});
//@route DELETE api/posts/:postid
//@desc Delete post
//@access Private
router.delete("/:postid",auth,async (req,res)=>
{
    try {

        const post= await Post.findById(req.params.postid);

        if(!post) return res.status(404).json({msg:"Post not found"});

        if(post.user.toString()!== req.user.id)
        return res.status(401).json({msg:"User not authorized"});

        await post.remove();
        res.json({msg:"Post removed"});
        
    } catch(error){
        console.log(error.message);
        if(error.kind==="ObjectId")
        return res.status(404).json({msg:"Post not found"});
        res.status(500).send("Server error");
    }

});

//@route PUT api/posts/like/:postid
//@desc Like a post
//@access Private
router.put("/like/:postid",auth,async (req,res)=>
{
    try
    {
        const post= await Post.findById(req.params.postid);

        if(post.likes.filter(like => like.user.toString()===req.user.id).length>0)
        {
           return res.status(400).json({msg:"Post already Liked"});

        }
        post.likes.unshift({user:req.user.id});

        await post.save();

        res.json(post.likes);

    }catch(error)
    {
        console.log(error.message);
        if(error.kind==="ObjectId")
        return res.status(404).json({msg:"Post not found"});
        res.status(500).send("Server error");
    }
});

//@route PUT api/posts/unlike/:postid
//@desc Unlike a post
//@access Private
router.put("/unlike/:postid",auth,async (req,res)=>
{
    try
    {
        const post= await Post.findById(req.params.postid);

        if(post.likes.filter(like => like.user.toString()===req.user.id).length===0)
        {
            res.status(400).json({msg:"Post not Liked"});

        }
        

        //Get remove index
        const removeidx= post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeidx,1);

        await post.save();

        
        res.json(post.likes);

    }catch(error)
    {
        console.log(error.message);
        if(error.kind==="ObjectId")
        return res.status(404).json({msg:"Post not found"});
        res.status(500).send("Server error");
    }
})

//@route PUT api/posts/comment/:postid
//@desc Comment on a post
//@access Private

router.post('/comment/:postid', [auth,
    [check("text","Text is required").not().isEmpty()] 
 ],
 async (req, res) => {
     const errors=validationResult(req);
     if(!errors.isEmpty())
     {
         return res.status(400).json(errors.array());
     }
     try
     {
         const user1= await User.findById(req.user.id).select("-password");
        const post=await Post.findById(req.params.postid);

         const newComment=
         {
             text:req.body.text,
             user:req.user.id,
             name:user1.name,
             avatar:user1.avatar
 
         };

         post.comments.unshift(newComment);

         await post.save();
         
         res.json(post);
 
 
     }catch(err)
     {
         console.log(err.message);
         res.status(500).send("Server error");
     }
 
 });

//@route DELETE api/posts/comment/:postid/:commentid
//@desc Delete comment
//@access Private
 
router.delete("/comment/:postid/:commentid",auth, async (req,res)=>{
    try {

        const post=await Post.findById(req.params.postid);
        

        const comment=post.comments.find(comment => comment.id===req.params.commentid);
        
        if(!comment)
        return res.status(400).json({msg:"Comment does not exist"});

        if(req.user.id !==comment.user.toString())
        return res.status(401).json({msg:"User not authorized"});
        
        const removeidx= post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeidx,1);

        await post.save();

        res.json(post.comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");    
    }
})


module.exports=router;