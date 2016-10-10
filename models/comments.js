var mongoose = require('mongoose');
var UserSchema = require('./user');
var ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: String,
  updatedAt: String,
  body: String
});

CommentSchema.pre('save', function(next){
  now = new Date();
  this.updatedAt = now.toLocaleString();
  if (!this.createdAt) {
    this.createdAt = now.toLocaleString();
  }
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
