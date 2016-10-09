var mongoose = require('mongoose');
var validate = require('mongoose-validate');
var passportLocalMongoose = require('passport-local-mongoose');
var ReviewSchema = require('./review');
var LocationSchema = require('./location');


var UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true, validate: [validate.email, 'invalid email address']},
  dog: String,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
