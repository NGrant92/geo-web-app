"use strict";

const Message = require("../models/message");
const Boom = require("boom");

exports.find = {
  auth: { strategy: 'jwt'},

  handler: function(request, reply) {
    Message.find({})
      .exec()
      .then(messages => {
        reply(messages);
      })
      .catch(err => {
        reply(Boom.badImplementation("error accessing db"));
      });
  }
};

exports.findOne = {
  auth: { strategy: 'jwt'},

  handler: function(request, reply) {
    Message.findOne({ _id: request.params.id })
      .then(message => {
        reply(message);
      })
      .catch(err => {
        reply(Boom.notFound("id not found"));
      });
  }
};

exports.create = {
  auth: { strategy: 'jwt'},

  handler: function(request, reply) {
    const message = new Message(request.payload);
    message.user = utils.getUserId(request);
    message
      .save()
      .then(newMessage => {
        reply(newMessage).code(201);
      })
      .catch(err => {
        reply(Boom.badImplementation("error creating message"));
      });
  }
};

exports.deleteAll = {
  auth: { strategy: 'jwt'},

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
  auth: { strategy: 'jwt'},

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
