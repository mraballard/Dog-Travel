var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');


// INDEX Route
router.get('/', function(req, res) {
  res.redirect('/login');
});

router.get('/login', function(req,res){
  res.render('login', {message: req.flash('info'), title: 'The Dog Travel App'});
});

// POST LOGIN ROUTE USING PROMISES //
router.post('/login', passport.authenticate('local',{failureRedirect: '/'}), function(req, res){
  req.session.save(function(err) {
    if (err) {
      req.flash('info', err.message);
      res.redirect('/login');
    }
    else {
      User.findOne({username: req.user.username}).exec()
      .then(function(user){
        res.redirect('/home');
      })
      .catch(function(err){
        req.flash('info', err.message);
        res.redirect('/login');
      });
    }
  });
});

router.get('/signup', function(req, res){
  res.render('signup');
})
// CREATE USER FROM SIGNUP //
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
