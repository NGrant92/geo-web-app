"use strict";

const Cache = require("../models/cache");
const Following = require("../models/following");
const Boom = require("boom");
const utils = require("./utils.js");
const Logger = require("../utils/logger");

exports.find = {
  auth: { strategy: "jwt" },

  handler: function(request, reply) {
    Cache.find({})
      .populate("user")
      .exec()
      .then(caches => {
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
    let followeeCaches = [];
    Following.findFollowees({ follower: utils.getUserId(request) })
      .then(followees => {
        followees.forEach(followee => {
          Cache.find({ user: followee })
            .populate("user")
            .then(caches => {
              Logger.info("FOR EACH CACHES ARRAY");
              Logger.info(caches);
              //https://stackoverflow.com/a/32511679
              followeeCaches.push(...caches);
            });
        });
      })
      .then(res => {
        Logger.info("FOLLOWEE CACHES:");
        Logger.info(followeeCaches);
        reply(followeeCaches).code(201);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
        Logger.info(err);
      });
  }
};
