"use strict";
const User = require("../models/user");
const Joi = require("joi");
const Logger = require("../utils/logger");

const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.main = {
  auth: false,
  handler: function(request, reply) {
    reply.view("main", { title: "Welcome to Geo" });
  }
};

exports.signup = {
  auth: false,
  handler: function(request, reply) {
    reply.view("signup", { title: "Sign up for Geo" });
  }
};

exports.login = {
  auth: false,
  handler: function(request, reply) {
    reply.view("login", { title: "Login to Geo" });
  }
};

exports.logout = {
  auth: false,
  handler: function(request, reply) {
    request.cookieAuth.clear();
    reply.redirect("/");
  }
};

exports.authenticate = {
  auth: false,

  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    },
    options: {
      abortEarly: false
    },
    failAction: function(request, reply, source, error) {
      reply
        .view("login", {
          title: "Sign in error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email })
      .then(foundUser => {
        bcrypt.compare(user.password, foundUser.password).then(isValid =>  {
          if (isValid) {
            request.cookieAuth.set({
              loggedIn: true,
              loggedInUser: user.email
            });
            reply.redirect("/home");
          } else {
            reply.redirect("/signup");
          }
        });
      })
      .catch(err => {
        reply.redirect("/signup");
      });
  }
};

exports.userRegister = {
  auth: false,

  validate: {
    payload: {
      //Upper case letter followed by a minimum of 1 lower case letters
      firstName: Joi.string().regex(/^[A-Z][a-z]{1,}$/).required(),
      //Upper case letter followed by at least 1 lower or upper case letters, allows for McDonald as well as Trump
      lastName: Joi.string().regex(/^[A-Z][a-zA-Z]{1,}$/).required(),
      //Must follow the 00/00/0000 or 00/00/00 format
      dob: Joi.string().regex(/^[0-9]{2}[/][0-9]{2}[/][0-9]{2,4}$/).required(),
      //already handled by joi
      email: Joi.string().email().required(),

      //ref: https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength
      //must have at least 1 upper case character, 1 lower case, 1 integer, 1 special character and a minimum length of 8 characters long
      password: Joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$&*]).{8,}$/).required()
    },
    options: {
      abortEarly: false
    },
    failAction: function(request, reply, source, error) {
      reply
        .view("signup", {
          title: "Signup error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const user = new User(request.payload);
    const plaintextPassword = user.password;
    const isAdmin = request.params.admin === "true";

    user.img =
      "http://res.cloudinary.com/ngrant/image/upload/v1513088924/white-pin-green-back_iy4fax.png";
    user.admin = false;

    bcrypt.hash(plaintextPassword, saltRounds, function(err, hash) {
      user.password = hash;
      return user
        .save()
        .then(newUser => {
          if (isAdmin) {
            reply.redirect("/home");
          } else {
            reply.redirect("/login");
          }
        })
        .catch(err => {
          console.log(err);
          reply.redirect("/");
        });
    });
  }
};

exports.viewSettings = {
  handler: function(request, reply) {
    const userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail })
      .then(foundUser => {
        reply.view("settings", {
          title: "Edit Account Settings",
          user: foundUser
        });
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.updateSettings = {
  validate: {
    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    },

    options: {
      abortEarly: false
    },

    failAction: function(request, reply, source, error) {
      reply
        .view("signup", {
          title: "Update error",
          errors: error.data.details
        })
        .code(400);
    }
  },

  handler: function(request, reply) {
    const newUser = request.payload;
    const loggedInUserEmail = request.auth.credentials.loggedInUser;

    User.findOne({ email: loggedInUserEmail })
      .then(user => {
        user.firstName = newUser.firstName;
        user.lastName = newUser.lastName;
        user.email = newUser.email;
        user.password = newUser.password;
        return user.save();
      })
      .then(user => {
        reply.redirect("/home");
      })
      .catch(err => {
        reply.redirect("/");
      });
  }
};

exports.isAdmin = {
  handler: function(request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser })
      .then(user => {
        if (user.admin) {
          reply.redirect("/home/admin");
        } else {
          reply.redirect("/home/user");
        }
      })
      .catch(err => {
        console.log(err);
        reply.redirect("/");
      });
  }
};
