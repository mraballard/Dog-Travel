var mongoose = require('mongoose');
var ReviewSchema = require('./review');

var LocationSchema = new mongoose.Schema({
  city: String,
  state: String,
  country: String,
  place: String
});

module.exports = mongoose.model('Location', UserSchema);
