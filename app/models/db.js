'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = "mongodb://geouser:geouser@ds149865.mlab.com:49865/geo-cache";
//let dbURI = 'mongodb://localhost/geocache';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);

  if (process.env.NODE_ENV !== 'production') {
    let seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Message = require('./message');
    const Cache = require('./cache');
    const User = require('./user');
    const Following = require('./following');

    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
    }).catch(err => {
      console.log(error);
    });
  }
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
