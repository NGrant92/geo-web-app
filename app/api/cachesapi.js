"use strict";

const Cache = require("../models/cache");
const Boom = require("boom");

exports.find = {
  auth: { strategy: 'jwt'},

  handler: function(request, reply) {
    Cache.find({})
      .exec()
      .then(caches => {
        reply(caches);
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.findOne = {
  auth: { strategy: 'jwt'},

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
  auth: { strategy: 'jwt'},

  handler: function(request, reply) {
    const cache = new Cache(request.payload);
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
  auth: { strategy: 'jwt'},

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
  auth: { strategy: 'jwt'},

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
