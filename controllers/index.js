var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


// INDEX Route
router.get('/', function(req, res) {
  res.send('Index')
  // res.render('home', {message: req.flash('ingo'), title: 'The Dog Travel App'});
});


module.exports = router;
