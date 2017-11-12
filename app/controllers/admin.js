"use strict";
const Cache = require("../models/cache");
const User = require("../models/user");
const Message = require("../models/message");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    let loggedUser;
    let allCaches;
    let allUsers;
    let allMessages;

    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(foundUser => {
        loggedUser = foundUser;
        return User.find({admin: false});
      })
      .then(users => {
        allUsers = users;
        return Cache.find({}).populate("user");
      })
      .then(caches => {
        allCaches = caches.reverse();
        return Message.find({}).populate("user");
      })
      .then(messages => {
        allMessages = messages.reverse();
      })
      .then(result => {
        reply.view("homeadmin", {
          title: "Admin Home",
          allCaches: allCaches,
          user: loggedUser,
          userlist: allUsers,
          allMessages: allMessages
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.remUser = {
  handler: function(request, reply) {
    let userEmail = request.params.email;

    User.find({ email: userEmail })
      .then(foundUser => {
        Cache.remove({ user: foundUser }).then(result => {
          console.log("Removed caches of user");
        });
      })
      .then(result => {
        User.findOneAndRemove({ email: userEmail }).then(result => {
          console.log("Removed user");
        });
      })
      .then(result => {
        reply.redirect("/home");
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};
