var mongoose = require('mongoose');
var UserSchema = require('./user');
var LocationSchema = require('./location');

var ReviewSchema = new mongoose.Schema({
  author: String,  // This will be user ID who writes post
  title: String,
  location: LocationSchema,
  theGood: String,
  theBad: String,
  createdAt: Date,
  updatedAt: Date
});

ReviewSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
