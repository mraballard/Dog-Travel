var express = require('express');
var app = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Location = require('./models/location');
var User = require('./models/user');
var Comment = require('./models/comments');
var Review = require('./models/review');

var indexController = require('./controllers/index.js');
var usersController = require('./controllers/users.js');

mongoose.Promise = global.Promise;
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/dog-app';
mongoose.connect(mongoURI);

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());  // Need this?
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(express.static('public'));
app.use(require('express-session')({
  secret: 'hugo the boss',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexController);
app.use('/user', usersController);

//Databse Setup
var db = mongoose.connection;
db.on('error', function(err){ console.log(err); });
db.once('open', function(){ console.log('Connected to Mongo database'); });

// Review.remove({}) //Clears database reviews and starts from zero
// .then(function(){
//
// })


app.get('/', function(req, res) {
  res.json({status: 200, message: "Server up and running"});
});

app.listen(process.env.PORT || 3000);
