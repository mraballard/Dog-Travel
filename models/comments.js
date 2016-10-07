var mongoose = require('mongoose');
var UserSchema = require('./user');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: Date,
  updatedAt: Date,
  comment: String
});

CommentSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
