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
  res.render('about');
});
// POST LOGIN ROUTE USING PROMISES //
router.get('/login', function(req,res){
  if (req.user) {
    req.flash('info', 'You are already signed in, '+req.user.firstName+'!');
    res.redirect('/reviews');
  }
  else {
    res.render('login', {
      message: req.flash('info'),
      appTitle: "Dogventures"});
  }
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
        console.log(user);
        req.flash('info', `Welcome ${user.firstName}!`)
        res.redirect('/reviews');
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
  res.render('signup', {
    title: "Dogventures",
    message: req.flash('info')
  });
})
router.post('/signup', function(req,res){
  User.register(
    new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dog: req.body.dogName
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        req.flash('info', err.message);
        res.redirect('/signup');
      }
      else {
        req.flash('info', `Welcome! ${req.user.username}`);
        res.redirect('/reviews');
      }
    }
  );
});

// Signout USER //
router.delete('/logout', function(req, res) {
  req.logout();
  req.flash('info', ' Successfully signed out! ')
  res.redirect('/');
});

module.exports = router;
