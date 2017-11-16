var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var randomString = require('randomstring');
var session = require('express-session');
var request = require("request");
var { Iamporter, IamporterError } = require('iamporter');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html')
app.set('views', 'views')
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret:'@#@sadfdfasdfasdfasfsdfasdffsdfs#@$#$',
    resave: false,
    saveUninitialized:true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));

mongoose.connect('mongodb://localhost:27017/diehard') ;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
    console.log("Mongo DB ON");
});

var iamporter = new Iamporter();

var user = mongoose.Schema({
    token:String,
    userCode:String,
    name:String,
    id:String,
    password:String,
    profileImage:String,
    credit:Number,
    cardNumber:String,
    cardPassword:String,
    cardBirthday:String,
    cardExpiry:String,
});

var room = mongoose.Schema({
    user1Token:String,
    user2Token:String,
    awardCredit:String,
    goalDistance:Number,
    user1Distance:Number,
    user2Distance:Number,
    user1Name:String,
    user2Name:String,
});

var friend = mongoose.Schema({
    friendName:String,
    friendToken:String,
    friendCode:String,
    token:String,
    win:Number,
    lose:Number,
});

var acceptFriend = mongoose.Schema({
    token:String,
    friendToken:String,
    acceptToken:String,
    name:String,
    code:String,
});

var acceptRoom = mongoose.Schema({
    token:String,
    friendToken:String,
    awardCredit:String,
    goalDistance:Number,
    acceptToken:String,
    name:String,
    friendName:String,
});

var userModel = mongoose.model('userModel',user);
var roomModel = mongoose.model('roomModel',room);
var friendModel = mongoose.model('friendModel',friend);
var acceptFriendModel = mongoose.model('acceptFriendModel',acceptFriend);
var acceptRoomModel = mongoose.model('acceptRoomModel',acceptRoom);

require('./routes/auth')(app , userModel , randomString , session);
require('./routes/user')(app , userModel , iamporter , IamporterError , randomString , session);
require('./routes/friend')(app , friendModel , userModel , acceptFriendModel , randomString , session);
require('./routes/room')(app , userModel , roomModel , acceptRoomModel , randomString , friendModel , session);
require('./routes/route')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
