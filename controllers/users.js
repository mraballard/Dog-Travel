var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Review = require('../models/review');
var Location = require('../models/location');

// authenticate user function
var authenticate = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next()
  }
}
// Function to find review with given array in user's array of reviews
var findReview = function(arr,id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]._id == id) {
      console.log('returning.... '+arr[i]);
      return arr[i];
    }
  }
  return null;
}

// Users Reviews Index Route
router.get('/reviews', authenticate, function(req, res){
  console.log('User Home');
  res.render('reviews/home', {
    user: req.user,
    reviews: req.user.reviews
  });
});

// Users Show Review Route
router.get('/reviews/:postId', authenticate, function(req, res){
  var review = findReview(req.user.reviews, req.params.postId);
  console.log(review);
  console.log(review.title);
  var id = review._id.toString();
    res.render('reviews/show', {  //tried passing review: review but it wouldn't load. Had to define each property
      user: req.user,
      // review: review,
      title: review.title,
      location: review.location,
      createdAt: review.createdAt,
      theGood: review.theGood,
      theBad: review.theBad,
      id: id
    });
});

// CREATE NEW POST
router.get('/new', authenticate, function(req, res){
  res.render('reviews/new', {user: req.user});
});
router.post('/new', function(req, res){
  Review.create({
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
  .then(function(review){
    req.user.reviews.push(review);
    req.user.save();
  });
  res.redirect(`/user/${req.params.userId}`);
});
// EDIT POST GET ROUTE
router.get('/reviews/:postId/edit', authenticate, function(req, res){
  var review = findReview(req.user.reviews, req.params.postId);
  var id = review._id.toString();
  res.render(`reviews/edit`, {
      user: req.user,
      title: review.title,
      location: review.location,
      theGood: review.theGood,
      theBad: review.theBad,
      id: id
    });
});
// EDIT POST UPDATE ROUTE
router.patch('/reviews/:postId/edit', function(req, res){
  Review.findOne({_id: req.params.postId}).exec()
  .then(function(review){
    console.log('This is the review from reviews collection: '+review);
    review.title = req.body.title;
    review.location.city = req.body.city;
    review.location.state = req.body.state;
    review.location.country = req.body.country;
    review.location.place = req.body.place;
    review.theGood = req.body.theGood;
    review.theBad = req.body.theBad;
    review.save();
  })
  .then(function(){
    return reviewInUserArray = findReview(req.user.reviews, req.params.postId)
  })
  .then(function(review){
    console.log('This is the review from array: '+review);
    review.title = req.body.title;
    review.location.city = req.body.city;
    review.location.state = req.body.state;
    review.location.country = req.body.country;
    review.location.place = req.body.place;
    review.theGood = req.body.theGood;
    review.theBad = req.body.theBad;
    console.log('This is the updated review: '+review);
  })
  .then(function(){
      res.redirect(`/reviews/${req.params.postId}`);
  });
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
