"use strict";

const Following = require("../models/following");
const Boom = require("boom");
const utils = require("./utils.js");
const userapi = require("./usersapi");
const Logger = require("../utils/logger");

exports.findFollowers = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.find({ followee: request.params.id })
      .populate("follower")
      .exec()
      .then(followings => {
        //https://stackoverflow.com/a/46694321
        let followerList = followings.map(following => {
          return following.follower;
        });
        reply(followerList);
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.findFollowees = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.find({ follower: request.params.id })
      .populate("followee")
      .exec()
      .then(followings => {
        //https://stackoverflow.com/a/46694321
        let followeeList = followings.map(following => {
          return following.followee;
        });
        reply(followeeList);
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.create = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    const following = new Following(request.payload);
    following
      .save()
      .then(newFollowing => {
        Following.findOne(newFollowing)
          .populate("follower")
          .then(following => {
            reply(following.follower);
          });
      })
      .catch(err => {
        reply(Boom.badImplementation("error creating following"));
      });
  }
};

exports.unfollow = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.remove({ _id: request.params.id })
      .then(following => {
        reply(following).code(204);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.findOne = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.findOne({ _id: request.params.id })
      .then(following => {
        reply(following);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};
