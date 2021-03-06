
'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: String,
  email: String,
  password: String,
  img: String,
  admin: Boolean
});

const User = mongoose.model('User', userSchema);
module.exports = User;