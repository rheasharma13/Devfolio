const express = require('express');
const router = require('express').Router();

//@route GET
//@desc Test
//@access Public

router.get('/', (req, res) => {
res.send("Posts route")	
});

module.exports=router;