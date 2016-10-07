var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Review = require('../models/review');
var Location = require('../models/location');

// ROOT redirects to login Route
router.get('/', function(req, res) {
  res.redirect('/login');
});
// ABOUT US
router.get('/about', function(req, res) {
  res.redirect('/login');
});
// INDEX ROUTE
router.get('/index', function(req, res) {
  Review.find({}).exec()
  .then(function(reviews){
    var viewData = {reviews: reviews, user: req.user};
    var searchString = req.query.search;
    if (searchString) {
      viewData.reviews = reviews.filter(function(review){
        return review.location.city.toLowerCase().includes(searchString.toLowerCase());
      });
    }
    res.render('reviews/index',viewData);
  });
});
// SHOW ROUTE --  NO USER LOGGED IN
router.get('/index/reviews/:postId', function(req, res) {
  Review.findOne({_id: req.params.postId}).populate('user')
  .then(function(review){
    var postId = review.user._id.toString();
    var userId = req.user._id.toString();
    if (postId === userId) {
      console.log(postId, userId);
      var sameUser = true;
    }
    else {
      var sameUser = false;
      console.log(postId, userId);
    }
      res.render('reviews/show',{
        review: review,
        user: req.user,
        isUser: sameUser
      });
  });
});
// POST LOGIN ROUTE USING PROMISES //
router.get('/login', function(req,res){
  res.render('login', {message: req.flash('info'), title: "Travel with man's best friend"});
});
router.post('/login', passport.authenticate('local',{failureRedirect: '/'}), function(req, res){
  req.session.save(function(err) {
    if (err) {
      req.flash('info', err.message);
      res.redirect('/login');
    }
    else {
      User.findOne({username: req.user.username}).exec()
      .then(function(user){
        res.redirect('/index');
      })
      .catch(function(err){
        req.flash('info', err.message);
        res.redirect('/login');
      });
    }
  });
});

// CREATE USER FROM SIGNUP //
router.get('/signup', function(req, res){
  res.render('signup', {message: req.flash('info')});
})
router.post('/signup', function(req,res){
  User.register(
    new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      reviews: [],
      dog: req.body.dogName
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        req.flash('info', err.message);
        res.redirect('/signup');
      }
      else {
        res.redirect('/login');
      }
    }
  );
});

// Signout USER //
router.delete('/logout', function(req, res) {
  req.logout();
  req.flash('info', 'Successfully signed out!')
  res.redirect('/');
});

module.exports = router;
