"use strict";

const Message = require("../models/message");
const Following = require("../models/following");
const cloudinary = require('cloudinary');
const Boom = require("boom");
const utils = require("./utils.js");

exports.find = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Message.find({})
      .populate("user")
      .exec()
      .then(messages => {
        reply(messages.reverse());
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.findOne = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Message.findOne({ _id: request.params.id })
      .populate("user")
      .then(message => {
        reply(message);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.create = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    const message = new Message(request.payload);
    message.user = utils.getUserId(request);
    message
      .save()
      .then(newMessage => {
        Message.findOne(newMessage)
          .populate("user")
          .then(message => {
            reply(message).code(201);
          });
      })
      .catch(err => {
        reply(Boom.badImplementation("error creating message"));
      });
  }
};

exports.deleteAll = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Message.remove({})
      .then(err => {
        reply().code(204);
      })
      .catch(err => {
        reply(Boom.badImplementation("error removing messages"));
      });
  }
};

exports.deleteOne = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Message.remove({ _id: request.params.id })
      .then(message => {
        reply(message).code(204);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.findFolloweeMessages = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Following.find({ follower: utils.getUserId(request) })
      .then(followingList => {
        return followingList.map(res => {
          return res.followee;
        });
      })
      .then(followingList => {
        return Message.find({ user: { $in: followingList } })
          .populate("user")
          .exec();
      })
      .then(followingMessages => {
        reply(followingMessages).code(201);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
        Logger.info(err);
      });
  }
};
