var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Review = require('../models/review');
var Location = require('../models/location');

// authenticate user function
var authenticate = function(req, res, next) {
  if (!req.user || req.user._id != req.params.userId) {
    res.redirect('/login');
  } else {
    next()
  }
}

router.get('/:userId', authenticate, function(req, res){
  res.render('reviews/home', {user: req.user});
});
// CREATE NEW POST
router.get('/:userId/new', authenticate, function(req, res){
  res.render('reviews/new', {user: req.user});
});
// EDIT POST
router.get('/:userId/:postId', authenticate, function(req, res){
  res.render('reviews/edit', {user: req.user});
});
// PROFILE ROUTE
router.get('/:userId/profile', authenticate, function(req, res){
  res.render('/profile/show', {user: req.user});
});
// EDIT PROFILE
router.get('/:userId/profile/edit', authenticate, function(req, res){
  res.render('/profile/edit', {user: req.user});
});

module.exports = router;
