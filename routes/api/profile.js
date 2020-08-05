const mongoose=require('mongoose');
const router = require('express').Router();
const auth=require('../../middleware/auth');
const User=require('../../models/User');
const Profile=require('../../models/Profile');
const {check,validationResult} =require('express-validator');

//@route GET api/profile/me
//@desc Get profile of user
//@access Private

router.get('/me', auth, async (req, res) => {
    try
    {
        const profile=await Profile.findOne({user:req.user.id}).populate("user",["name","avatar"]);
        
        if(!profile)
        res.status(400).json({msg:'There is no profile available for this user'});

        res.json(profile);
    }catch(err)
    {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

//@route POST api/profile
//@desc Create or update Profile
//@access Private
router.post('/',[auth,[
check('status','Status is required').not().isEmpty(),
check('skills','Skills are required').not().isEmpty(),
check('handle','Handle is required').not().isEmpty()
]
] ,async (req,res)=>
{
    const errors=validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors:errors.array()});
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
     
          // Skills - Spilt into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',').map(skill=>skill.trim());
      }

      profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
  
    try{

        let prof=await Profile.findOne({user:req.user.id});
        if(prof)
        {
            //Update existing profile
            await Profile.findOneAndUpdate(
                {
                    user:req.user.id
                },
                {
                    $set:profileFields
                },
                {new:true}
            );
        }
            profile=new Profile(profileFields);
            await profile.save();
            res.json(profile);

    }
    catch(err)
    {
        console.error(err.message);
        res.status(400).send('Server error');
    }

});

//@route GET api/profile
//@desc Get all profiles
//@access Public
router.get("/", async (req,res) =>{
try
{
    const profiles=await Profile.find().populate('user',['name','avatar']).
    exec((err,profiles)=>
    {
        
        res.json(profiles);
    });
   
   
}catch(err)
{
    console.error(err.message);
    res.status(400).send("Server error");
}
    

});

//@route GET api/profile/user/:userid
//@desc Get the profile of a user
//@access Public
router.get("/user/:userid",async (req,res) =>
{
    try
    {
        const prof=await Profile.findOne({user:req.params.userid}).populate("user",["name","avatar"]);
        if(!prof)
        return res.status(400).json({msg:"Profile not available for this user"});

        res.json(prof);
    }catch(err)
    {
        console.error(err.message);
        if(err.kind=='ObjectId')
        return res.status(400).json({msg:"There is no profile for this user"});
        res.status(500).send("Server error");
    }

});

//@route DELETE api/profile
//@desc Delete profile,user and posts
//@access Private

router.delete("/",auth,async (req,res) =>
{
    try {
    //Delete Profile    
    await Profile.findOneAndRemove({user:req.user.id});

    //Delete User
    await User.findOneAndRemove({id:req.user.id});

    res.json({msg:"User deleted"});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error"); 
    }
    
});

//@route PUT api/profile/experience
//@desc Add Profile Experience
//@access Private
router.put("/experience",[auth,
    [
        check("title","Title is required").not().isEmpty(),
        check("company","Company is required").not().isEmpty(),
        check("from","From Date is required").not().isEmpty()

    ]
], async(req,res) =>
{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json(errors.array());
    }
    const
    {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }=req.body;
    const newexp={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
         prof= await Profile.findOne({user:req.user.id});
        prof.experience.unshift(newexp);
       await prof.save();
        res.json(prof);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
        
    }
});

//@route DELETE api/profile/experience/:expid
//@desc Delete profile experience
//@access Private
router.delete("/experience/:expid",auth,async (req,res)=>
{
    try {
        const prof=await Profile.findOne({user:req.user.id});
        const removeIndex=prof.experience.map(item=> item.id).indexOf(req.params.expid);

        prof.experience.splice(removeIndex,1);

        await prof.save();
        res.json(prof);


        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
        
    }
});

//@route PUT api/profile/education
//@desc Add Profile Education
//@access Private
router.put("/education",[auth,
    [
        check("school","School is required").not().isEmpty(),
        check("degree","Degree is required").not().isEmpty(),
        check("fieldofstudy","Field of study is required").not().isEmpty(),
        check("from","From Date is required").not().isEmpty()

    ]
], async(req,res) =>
{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json(errors.array());
    }
    const
    {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }=req.body;
    const newedu={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
         prof= await Profile.findOne({user:req.user.id});
        prof.education.unshift(newedu);
       await prof.save();
        res.json(prof);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
        
    }
});

//@route DELETE api/profile/education/:expid
//@desc Delete profile education
//@access Private
router.delete("/education/:expid",auth,async (req,res)=>
{
    try {
        const prof=await Profile.findOne({user:req.user.id});
        const removeIndex=prof.education.map(item=> item.id).indexOf(req.params.expid);

        prof.education.splice(removeIndex,1);

        await prof.save();
        res.json(prof);


        
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
        
    }
})

module.exports=router;