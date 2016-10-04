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
      res.render('reviews/index',{
        reviews: reviews
      });
  });
});
// POST LOGIN ROUTE USING PROMISES //
router.get('/login', function(req,res){
  res.render('login', {message: req.flash('info'), title: 'The Dog Travel App'});
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
  res.render('signup');
})
router.post('/signup', function(req,res){
  User.register(
    new User({
      username: req.body.username,
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
