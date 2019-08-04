var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser=require('body-parser');
var logger = require('morgan');
const exphbs=require('express-handlebars');
var bcrypt=require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');


var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter=require('./routes/users');
//var sumRouter=require('./routes/sum');


const multer=require('multer');
const mongoose=require('mongoose');

var app = express();

// connect to mongo db
mongoose.connect('mongodb://localhost/hr');

// setting middleware for handlebars
app.engine('handlebars',exphbs({defaultLayout:'main'}));

app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// middleware for flash
app.use(flash());
// declare global variables
app.use(function(req,res,next){
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  next();
});

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users',usersRouter);
//app.use('/sum',sumRouter);


app.listen(5000);
console.log('Server started on port 5000');
module.exports = app;
