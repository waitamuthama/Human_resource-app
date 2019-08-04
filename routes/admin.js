var express = require('express');
var router = express.Router();
const mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
const passport = require('passport');
//load employee model
require('../models/employee');
require('../models/sum');
const User=mongoose.model('users')
const Sum=mongoose.model('sums');
//const Sum=mongoose.model('sum');

/* GET register route*/
router.get('/register', function(req, res, next) {
  res.render('admin/register');
});

router.get('/computesum', function(req, res, next) {
  res.render('admin/computesum');
});

// post values to database
router.post('/computesum',function(req,res){

  var val1=req.body.val1;
  var val2=req.body.val2;
  var total= Sum(val1+val2);
  let errors=[];

  if(!req.body.val1){
  errors.push({tetx:'val is empty'});
  }
  if(errors.length>0){
    res.render('/admin/computesum',{
      errors:errors,
      val1:req.body.val1
    });
  }else{
  const newSum={
    val1:req.body.val1,
    val2:req.body.val2,
    total
  }
  new Sum(newSum)
  .save()
  console.log(newSum);
  res.redirect('/admin/computesum');

}
});

//post users data
router.post('/register',function(req,res){
let errors = [];
if(!req.body.name){
  errors.push({text:'Name field is empty'});
 }
 if(!req.body.email){
   errors.push({text:'Email field is empty'});
 }
 if(!req.body.contact){
   errors.push({text:'contact field is empty'});
 }
 if(req.body.password != req.body.password1){
   errors.push({text:'Passwords do not match'});
 }
 if(req.body.password.length < 2){
   errors.push({text:'Password must be at least 2 characters'});
 }

 if(errors.length > 0){
   res.render('admin/register', {
     errors: errors,
     name: req.body.name,
     email: req.body.email,
     contact:req.body.address,
     address:req.body.contact,
     password: req.body.password,
     password2: req.body.password2
   });
 } else {
   User.findOne({email: req.body.email})
     .then(user => {
       if(user){
         //req.flash('error_msg', 'Email already regsitered');
         res.redirect('/admin/register');
       } else {
         const newUser = {
           name: req.body.name,
           email: req.body.email,
           contact:req.body.contact,
           address:req.body.address,
           password: req.body.password
         }

         bcrypt.genSalt(10, (err, salt)=>{
                   bcrypt.hash(newUser.password, salt, (err, hash)=>{
                     if(err) throw err;
                     newUser.password = hash;
                     new User(newUser).save()
                       res.redirect('/admin/datamanage');
                   });
                 });

       }
     })
 }
});

// fetch users from database and display in data manage
router.get('/datamanage',function(req,res){
  User.find({},function(err,users){
    if(err){
    console.log(err);
    }
    var model={
      users:users
    }
      res.render('admin/datamanage',model);
  });
});

// load user edit form
router.get('/edit/:id',function(req,res){
  User.findOne({_id:req.params.id},function(err,user){
    if(err){
    console.log(err);
    }
    var model={
      user:user
    };
    res.render('admin/edit',model);
  });
});

// post user edit for
router.post('/edit/:id',function(req,res){
  let errors=[];
  if(!req.body.name){
    errors.push({text:'Please ensure all field are not empty'});
  }
  if(errors.length>0){
    res.render('admin/edit',{
      name:req.body.name,
      email:req.body.email,
      contact:req.body.contact,
      address:req.body.address
    });
  }else{
    User.update({_id:req.params.id},{
      name:req.body.name,
      email:req.body.email,
      contact:req.body.contact,
      address:req.body.address
    },function(err){
      if(err){
        console.log(err);
      }
      req.flash('success_msg','Employee data updated sucessfully');
      res.redirect('/admin/datamanage');
    });
  }
});




module.exports = router;
