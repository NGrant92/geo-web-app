"use strict";
const Cache = require("../models/cache");
const User = require("../models/user");
const Message = require("../models/message");
const Logger = require("../utils/logger");
const Joi = require("joi");

exports.home = {
  handler: function(request, reply) {
    let loggedUser;
    let userCaches;
    let allCaches;
    let allUsers;
    let allMessages;
    let userMessages;

    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(foundUser => {
        loggedUser = foundUser;
        return Cache.find({ user: loggedUser }).populate("user");
      })
      .then(userCacheList => {
        userCaches = userCacheList.reverse();
        return Cache.find({}).populate("user");
      })
      .then(caches => {
        allCaches = caches.reverse();
        return User.find({ admin: false });
      })
      .then(users => {
        allUsers = users;
        return Message.find({}).populate("user");
      })
      .then(messages => {
        allMessages = messages.reverse();
        return Message.find({ user: loggedUser }).populate("user");
      })
      .then(userMessageList => {
        userMessages = userMessageList.reverse();
      })
      .then(result => {
        reply.view("home", {
          title: "Home",
          allCaches: allCaches,
          user: loggedUser,
          userCaches: userCaches,
          userlist: allUsers,
          allMessages: allMessages,
          userMessages: userMessages
        });
      })
      .catch(err => {
        Logger.info(err);
        reply.redirect("/");
      });
  }
};

exports.viewUser = {
  handler: function(request, reply) {
    let paramEmail = request.params.email;
    let loggedInUser = request.auth.credentials.loggedInUser;
    let cacheList;
    let userFound;
    let userlist;
    let isAdmin;

    if (paramEmail !== loggedInUser) {
      User.findOne({ email: paramEmail })
        .then(foundUser => {
          userFound = foundUser;
          return User.find({ admin: false });
        })
        .then(users => {
          userlist = users;
          return Cache.find({ user: userFound }).populate("user");
        })
        .then(userCaches => {
          cacheList = userCaches.reverse();
          return User.findOne({ email: loggedInUser });
        })
        .then(loggedUser => {
          isAdmin = loggedUser.admin;
        })
        .then(result => {
          reply.view("viewuser", {
            title: userFound.firstName + "'s Profile",
            allCaches: cacheList,
            user: userFound,
            userlist: userlist,
            admin: isAdmin
          });
        })
        .catch(err => {
          Logger.info(err);
          reply.redirect("/");
        });
    } else {
      reply.redirect("/home");
    }
  }
};

exports.addCache = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    const cache = new Cache(request.payload);

    User.findOne({ email: userEmail })
      .then(user => {
        cache.user = user._id;
        return cache.save();
      })
      .then(newCache => {
        reply.redirect("/home");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.addMessage = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    const message = new Message(request.payload);

    User.findOne({ email: userEmail })
      .then(user => {
        message.user = user._id;
        return message.save();
      })
      .then(newMessage => {
        reply.redirect("/home");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.deleteAllCaches = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: userEmail })
      .then(user => {
        Cache.remove({ user: user.id }).then(result => {
          reply.redirect("/home");
        });
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};

exports.deleteAllMessages = {
  handler: function(request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: userEmail })
      .then(user => {
        Message.remove({ user: user.id }).then(result => {
          reply.redirect("/home");
        });
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};

exports.deleteCacheSet = {
  handler: function(request, reply) {
    let cacheSet = Object.keys(request.payload);

    for (let i = 0; i < cacheSet.length; i++) {
      Cache.remove({ _id: cacheSet[i] })
        .then(result => {
          console.log("Cache Removed: " + cacheSet[i]);
        })
        .catch(err => {
          console.log(err);
        });
    }
    reply.redirect("/home");
  }
};

exports.deleteMessageSet = {
  handler: function(request, reply) {
    let messageSet = Object.keys(request.payload);

    for (let i = 0; i < messageSet.length; i++) {
      Message.remove({ _id: messageSet[i] })
        .then(result => {
          console.log("Message Removed: " + messageSet[i]);
        })
        .catch(err => {
          console.log(err);
        });
    }
    reply.redirect("/home");
  }
};
