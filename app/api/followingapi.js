"use strict";

const Following = require("../models/following");
const Cache = require("../models/cache");
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
        //returns an array list people the user is following
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
          .populate("followee")
          .then(following => {
            reply(following);
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
    //searching for a following with a specific follower id and followee id
    Following.remove({
      follower: utils.getUserId(request),
      followee: request.params.id
    })
      .then(following => {
        reply().code(204);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
        Logger.info(err);
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