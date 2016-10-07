var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var Comment = require('../models/comments');
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
// var findReview = function(arr,id) {
//   for (var i = 0; i < arr.length; i++) {
//     if (arr[i]._id == id) {
//       console.log('returning.... '+arr[i]);
//       return arr[i];
//     }
//   }
//   return null;
// }

// Users Reviews Index Route
router.get('/reviews/:userId', authenticate, function(req, res){
  Review.find({user: req.params.userId}).populate('user').populate('comments.user').exec()
  .catch(function(error){
    console.log(error);
  })
  .then(function(reviews){
    console.log(reviews);
    res.render('reviews/home', {
      user: req.user,  //current user who is logged in
      reviews: reviews,
      owner: reviews[0].user.firstName
    });
  });
});
// CREATE NEW POST
router.get('/new', authenticate, function(req, res){
  console.log(req.user._id);
  res.render('reviews/new', {user: req.user});
});
router.post('/:userId/new', function(req, res){
  Review.create({
    // author: req.user._id,
    user: req.user,
    title: req.body.title,
    user: req.user,
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
    res.redirect(`/user/reviews`);
  });
});
// Users Show Review Route
router.get('/reviews/:userId/:postId', authenticate, function(req, res){
  console.log('Helloo');
  Review.findOne({_id: req.params.postId}).populate('user').populate('comments.user').exec()
  .catch(function(error){
    console.log(error);
  })
  .then(function(review){
    console.log('HELO');
    // console.log('user logged in' + req.user._id);
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

    res.render('reviews/show', {
      user: req.user,
      owner: review.user,
      review: review,
      isUser: sameUser
    });
  });
});
// COMMENT POST UPDATE ROUTE
router.patch('/reviews/:postId/', function(req, res){
  var newComment = new Comment({
    user: req.user,
    comment: req.body.comment
  });
  console.log('comment created');
  Review.findOne({_id: req.params.postId})
  .then(function(review){
    console.log('review found '+review);
    console.log('This is the comment '+newComment);
    review.comments.push(newComment);
    console.log('comment added '+review.comments);
    return review.save();
  })
  .then(function(review){
      res.redirect(`/user/reviews/${review._id}`);
  });
});
// EDIT POST GET ROUTE
router.get('/reviews/:postId/edit', authenticate, function(req, res){
  // var review = findReview(req.user.reviews, req.params.postId);
  // var id = review._id.toString();
  Review.findOne({_id: req.params.postId})
  .then(function(review){
    console.log('USER IS: '+ req.user);
    res.render(`reviews/edit`, {
        user: req.user,
        review: review
        // title: review.title,
        // location: review.location,
        // theGood: review.theGood,
        // theBad: review.theBad,
        // id: req.params.postId
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
      res.redirect(`/user/reviews/${review._id}`);
  });
});
// DELETE POST ROUTE
router.delete('/reviews/:postId', function(req,res){
  Review.remove({_id: req.params.postId}).exec()
  .then(function(){
    res.redirect('/user/reviews');
  });
});
// EDIT PROFILE
router.get('/:userId/profile', authenticate, function(req, res){
  res.render('profile/show', {user: req.user});
});
router.patch('/:userId/profile', function(req, res) {
    req.user.username = req.body.username;
    req.user.password = req.body.password;
    req.user.firstName = req.body.firstName;
    req.user.lastName = req.body.lastName;
    req.user.dog = req.body.dogName;
    req.user.save();
    res.redirect(`/user/reviews/`);
});

module.exports = router;
