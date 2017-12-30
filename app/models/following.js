"use strict";

const mongoose = require("mongoose");

const followingSchema = mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  followee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

const Following = mongoose.model("Following", followingSchema);
module.exports = Following;
