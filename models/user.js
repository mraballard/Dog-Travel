var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var ReviewSchema = require('./review');
var LocationSchema = require('./location');

var UserSchema = new mongoose.Schema({
  _id: Number,
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  dog: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
