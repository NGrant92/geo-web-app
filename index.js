'use strict';

//making hapi accessable in this file
const Hapi = require('hapi');
const corsHeaders = require('hapi-cors-headers');
const utils = require('./app/api/utils.js');
//creating new hapi server
let server = new Hapi.Server();

// const fs = require('fs');
// let options = {
//   port: 4000,
//   tls: {
//     key: fs.readFileSync('./app/private/ca-webserver.key'),
//     cert: fs.readFileSync('./app/private/ca-webserver.crt')
//   }
// };

//setting the server connection to localhost:4000
//server.connection(options); //uses https
server.connection({ port: process.env.PORT || 4000 }); //uses http

require('./app/models/db');

server.register([require('inert'), require('vision'), require('hapi-auth-cookie'), require('hapi-auth-jwt2')], err => {

  if (err) {
    throw err;
  }

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'geo-user-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',
  });

  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validateFunc: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.default({
    strategy: 'standard',
  });

  server.ext('onPreResponse', corsHeaders);
  //setting server route to routes.js
  server.route(require('./routes'));
  server.route(require('./routesapi'));

  //making server accessible it'll throw an error there is one
  server.start(err => {
    if (err) {
      throw err;
    }

    //console message
    console.log('server listening at: ', server.info.uri);
  });
});
