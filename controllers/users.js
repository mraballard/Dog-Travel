var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Review = require('../models/review');
var Location = require('../models/location');

router.get('/',function(req, res){

  res.render('reviews/home', {user: req.user});
});

router.get('/new',function(req, res){
  res.render('reviews/new');
});

module.exports = router;
