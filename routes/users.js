var express = require('express');
var router=express.Router();


router.get('/index',function(req,res,next){
  res.render('user/index');
});


router.get('/register',function(req,res,next){
  res.render('user/register');
});



module.exports= router;
