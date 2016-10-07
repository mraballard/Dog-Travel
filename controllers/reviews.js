var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Location = require('../models/location');
var User = require('../models/user');
var Comment = require('../models/comments');
var Review = require('../models/review');

// INDEX ROUTE
router.get('/', function(req, res) {
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
router.get('/:postId', function(req, res) {
  console.log('Revews route!!');
  Review.findOne({_id: req.params.postId}).populate('user')
  .then(function(review){
    if (!req.user) {
      var sameUser = false;
    }
    else {
      var reviewOwner = review.user._id.toString();
      var currentUser = req.user._id.toString();
      if (reviewOwner === currentUser) {
        var sameUser = true;
      }
      else {
        var sameUser = false;
      }
    }
    res.render('reviews/show',{
      review: review,
      user: req.user,
      owner: review.user,
      isUser: sameUser
    });
  });
});

module.exports = router;
