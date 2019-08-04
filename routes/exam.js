const express = require('express');
const router=express.Router();

router.get('/', function(req, res, next) {
  res.render('exam/index');
});

module.exports=router;
