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
var Review = require('./models/review');
var User = require('./models/user');



var usersController = require('./controllers/index.js');
var reviewsController = require('./controllers/review.js');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/dog-app');

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

app.use('/', usersController);
app.use('/home', reviewsController);

app.get('/', function(req, res) {
  res.json({status: 200, message: "Server up and running"});
});

app.listen(3000);
