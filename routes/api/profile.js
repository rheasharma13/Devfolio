
const router = require('express').Router();

//@route GET
//@desc Test
//@access Public

router.get('/', (req, res) => {
res.send("Profile route")	
});

module.exports=router;