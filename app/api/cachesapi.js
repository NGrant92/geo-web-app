"use strict";

const Cache = require("../models/cache");
const Following = require("../models/following");
const Boom = require("boom");
const utils = require("./utils.js");
const Logger = require("../utils/logger");

exports.findAll = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Cache.find({})
      .populate("user")
      .exec()
      .then(caches => {
        Logger.info("ALL CACHES: ");
        Logger.info("" + caches);
        reply(caches.reverse());
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.findOne = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Cache.findOne({ _id: request.params.id })
      .then(cache => {
        reply(cache);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.createCache = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    const cache = new Cache(request.payload);
    cache.user = utils.getUserId(request);
    cache
      .save()
      .then(newCache => {
        Cache.findOne(newCache)
          .populate("user")
          .then(cache => {
            reply(cache).code(201);
          });
      })
      .catch(err => {
        reply(Boom.badImplementation("error creating cache"));
      });
  }
};

exports.deleteAll = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Cache.remove({})
      .then(err => {
        reply().code(204);
      })
      .catch(err => {
        reply(Boom.badImplementation("error removing caches"));
      });
  }
};

exports.deleteOne = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Cache.remove({ _id: request.params.id })
      .then(cache => {
        reply(cache).code(204);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.findFolloweeCaches = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {

    Following.find({ follower: utils.getUserId(request) })
      .then(followingList => {
        return followingList.map(res => {
          return res.followee;
        });
      })
      .then(followingList => {
        return Cache.find({ user: {$in: followingList} })
          .populate("user")
          .exec();
      })
      .then(followingCaches => {
        reply(followingCaches).code(201);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
        Logger.info(err);
      });
  }
};
