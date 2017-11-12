"use strict";

const Message = require("../models/message");
const Boom = require("boom");

exports.find = {
  auth: false,

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
  auth: false,

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
  auth: false,

  handler: function(request, reply) {
    const message = new Message(request.payload);
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
  auth: false,

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
  auth: false,

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
