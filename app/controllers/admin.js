"use strict";
const Cache = require("../models/cache");
const User = require("../models/user");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(foundUser => {
        return Cache.find({})
          .populate("user")
          .then(caches => {
            return [caches.reverse(), foundUser];
          })
          .then(result => {
            return Cache.find({ user: result[1] })
              .populate("user")
              .then(myCaches => {
                return [result[0], result[1], myCaches.reverse()];
              });
          })
          .then(result => {
            return User.find({ admin: false }).then(userlist => {
              return [result[0], result[1], result[2], userlist];
            });
          });
      })
      .then(result => {
        reply.view("homeadmin", {
          title: "Admin Home",
          allCaches: result[0],
          user: result[1],
          userlist: result[3]
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
        User.findOneAndRemove({email: userEmail}).then(result => {
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
