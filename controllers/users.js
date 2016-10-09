var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Review = require('../models/review');
var Location = require('../models/location');

// authenticate user function
var authenticate = function(req, res, next) {
  if (!req.user || req.user._id.toString() !== req.params.userId.toString()) {
    req.flash('info', "Unable to verify user.");
    res.redirect('/login');
  } else {
    next();
  }
}
// Users Reviews Index Route
router.get('/:userId', function(req, res){
  Review.find({user: req.params.userId}).populate('user').exec()
  .catch(function(error){
    req.flash('info', error);
    res.redirect('/reviews');
  })
  .then(function(reviews){
    if (reviews.length === 0) {
      req.flash('info', 'That user has no reviews yet!');
      res.redirect('/reviews');
      console.log('No reviews '+reviews);
    }
    else {
      var viewData = {
        reviews: reviews,
        user: req.user,
        owner: reviews[0].user
      };
    }
    var searchString = req.query.search;
    if (searchString) {
      viewData.reviews = reviews.filter(function(review){
        return review.location.city.toLowerCase().includes(searchString.toLowerCase());
      });
    }
    res.render('reviews/index', viewData);
  });
});
// CREATE NEW POST
router.get('/:userId/new', authenticate, function(req, res){
  res.render('reviews/new', {user: req.user});
});
router.post('/:userId/new', function(req, res){
  Review.create({
    user: req.user,
    title: req.body.title,
    location: {
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      place: req.body.place
    },
    theGood: req.body.theGood,
    theBad: req.body.theBad
  })
  .catch(function(error){
    req.flash('info', error);
  })
  .then(function(review){
    res.redirect(`/user/${req.user._id}`);
  });
});
// Users EDIT Review Route
// router.get('/reviews/:postId', authenticate, function(req, res){
//   // var review = findReview(req.user.reviews, req.params.postId);
//   Review.findOne({_id: req.params.postId}).populate('user')
//   .then(function(review){
//     // console.log('posts author: '+review.user._id);
//     // console.log('user logged in' + req.user._id);
//     var postId = review.user._id.toString();
//     var userId = req.user._id.toString();
//     if (postId === userId) {
//       console.log(postId, userId);
//       var sameUser = true;
//     }
//     else {
//       var sameUser = false;
//       console.log(postId, userId);
//     }
//     res.render('reviews/show', {
//       user: req.user,
//       review: review,
//       isUser: sameUser
//     });
//   });
// });
// EDIT POST GET ROUTE
router.get('/:userId/:postId/edit', authenticate, function(req, res){
  Review.findOne({_id: req.params.postId}).exec()
  .catch(function(error){
    req.flash('info', error);
  })
  .then(function(review){
    res.render(`reviews/edit`, {
        user: req.user,
        review: review
    });
  });
});
// EDIT POST UPDATE ROUTE
router.patch('/reviews/:postId/edit', function(req, res){
  Review.findOne({_id: req.params.postId})
  .then(function(review){
    console.log('This is the review from reviews collection: '+review);
    review.title = req.body.title;
    review.location = {
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      place: req.body.place
    };
    review.theGood = req.body.theGood;
    review.theBad = req.body.theBad;
    return review.save();
  })
  .then(function(review){
      res.redirect(`/user/${req.user._id}`);
  });
});
// DELETE POST ROUTE
router.delete('/reviews/:postId', function(req,res){
  Review.remove({_id: req.params.postId}).exec()
  .then(function(){
    res.redirect(`/user/${req.user._id}`);
  });
});
// EDIT PROFILE
router.get('/:userId/profile', authenticate, function(req, res){
  res.render('profile/show', {user: req.user});
});
router.patch('/:userId/profile', function(req, res) {
    req.user.username = req.body.username;
    req.user.email = req.body.email;
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.dog = req.body.dogName;
    req.user.save();
    res.redirect(`/user/${req.user._id}`);
});

module.exports = router;
