"use strict";

const Following = require("../models/following");
const Boom = require("boom");
const utils = require("./utils.js");
const userapi = require("./usersapi");

exports.findFollowers = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.find({ followee: request.params.id })
      .populate("follower")
      .populate("followee")
      .exec()
      .then(followers => {
        reply(followers);
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
      .populate("follower")
      .populate("followee")
      .exec()
      .then(followings => {
        reply(followings.reverse());
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
    following.follower = utils.getUserId(request);
    following.followee = userapi.findOne(request.params.followee);
    following
      .save()
      .then(newFollowing => {
        Following.findOne(newFollowing)
          .populate("follower")
          .populate("followee")
          .then(following => {
            reply(following).code(201);
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
