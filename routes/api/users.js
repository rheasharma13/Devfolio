const express = require('express');
const router = require('express').Router();
const User=require('../../models/User.js');
const gravatar=require('gravatar');
const bcrypt=require('bcrypt')
const {check,validationResult}=require('express-validator')
 //@route POST /api/users
 //@desc Register a user
 //@access Public

 router.post('/', [
     check('name','Name is required').not().isEmpty(),
     check('email','Please enter a valid email').isEmail(),
     check('password','Please enter a password of more than 5 characters').isLength({
         min:5
     })
    ],async (req, res) => {
        const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Check if user already exists
  var {name,email,password} =req.body;

  try{
      var user= await User.findOne({email});
     if(user)
     {
         return res.status(400).json({errors:[{msg:'User Already Exists'}]});
     }
     console.log(req.body);
     

     //Get user's Gravatar
     var avatar=gravatar.url(email,
     {
         s:'200',
         r:'pg',
         d:'mm'
     });

     //Encrypt password
     var salt= await bcrypt.genSalt(10)
     password=await bcrypt.hash(password,salt);

      user=new User({
          name,
          email,
          avatar,
          password
      });

     await user.save();
     console.log(user);

     //Return JSON Web Token

     res.send('User registered');

     

  }catch(err)
  {
    console.error(err.message)
    res.status(500).send('Server error')
  }

     
 	
 });

 module.exports=router;