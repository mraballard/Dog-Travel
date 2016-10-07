var mongoose = require('mongoose');
var UserSchema = require('./user');
var LocationSchema = require('./location');
var CommentSchema = require('./comments').schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ReviewSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  title: String,
  location: LocationSchema,
  theGood: String,
  theBad: String,
  createdAt: Date,
  updatedAt: Date,
  likes: Number,
  comments: [CommentSchema]
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
