
const router = require('express').Router();
const authmiddleware=require('../../middleware/auth');
const User=require('../../models/User');
const config=require('config')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {check,validationResult}=require('express-validator')
//@route GET api/auth
//@desc Test
//@access Public

router.get('/',authmiddleware,  async (req, res) => {
    try {
        const user1= await User.findById(req.user.id).select('-password');
        res.json(user1);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
        
    }
	
});

//@route POST api/auth
//@desc Login user
//@access Public
router.post('/', [
    
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists()
   ],async (req, res) => {
       const errors = validationResult(req);
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }

 //Check if user already exists
 var {email,password} =req.body;

 try{
     var user= await User.findOne({email});
    if(!user)
    {
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
    }
    
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});
        }

    
    
     //return json web token
    const payload=
    {
        user:
        {
            id:user.id
        }
    }

    jwt.sign(payload,
       config.get('jwtSecret'),
       {expiresIn:360000},
       (err,token) => {
           if(err) throw err;
           res.json({token});
       });
    console.log(user);
    

 }catch(err)
 {
   console.error(err.message)
   res.status(500).send('Server error');
 }

    
    
});


module.exports=router;