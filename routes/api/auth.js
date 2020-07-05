
const router = require('express').Router();

//@route GET
//@desc Test
//@access Public

router.get('/', (req, res) => {
res.send("Auth route")	
});

module.exports=router;