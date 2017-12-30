const UsersApi = require("./app/api/usersapi");
const CachesApi = require("./app/api/cachesapi");
const MessagesApi = require("./app/api/messagesapi");
const FollowingApi = require("./app/api/followingapi");

module.exports = [
  {
    method: "POST",
    path: "/api/users/authenticate",
    config: UsersApi.authenticate
  },
  {
    method: "GET",
    path: "/api/users",
    config: UsersApi.find
  },
  {
    method: "GET",
    path: "/api/users/current",
    config: UsersApi.findCurrentUser
  },
  {
    method: "GET",
    path: "/api/users/{id}",
    config: UsersApi.findOne
  },
  {
    method: "POST",
    path: "/api/users",
    config: UsersApi.create
  },
  {
    method: "DELETE",
    path: "/api/users/{id}",
    config: UsersApi.deleteOne
  },
  {
    method: "DELETE",
    path: "/api/users",
    config: UsersApi.deleteAll
  },
  {
    method: "GET",
    path: "/api/caches",
    config: CachesApi.find
  },
  {
    method: "GET",
    path: "/api/caches/{id}",
    config: CachesApi.findOne
  },
  {
    method: "POST",
    path: "/api/caches",
    config: CachesApi.createCache
  },
  {
    method: "DELETE",
    path: "/api/caches/{id}",
    config: CachesApi.deleteOne
  },
  {
    method: "DELETE",
    path: "/api/caches",
    config: CachesApi.deleteAll
  },
  {
    method: "GET",
    path: "/api/messages",
    config: MessagesApi.find
  },
  {
    method: "GET",
    path: "/api/messages/{id}",
    config: MessagesApi.findOne
  },
  {
    method: "POST",
    path: "/api/messages",
    config: MessagesApi.create
  },
  {
    method: "DELETE",
    path: "/api/messages/{id}",
    config: MessagesApi.deleteOne
  },
  {
    method: "DELETE",
    path: "/api/messages",
    config: MessagesApi.deleteAll
  },
  {
    method: "GET",
    path: "/api/followers/{id}",
    config: FolllowingApi.findFollowers
  },
];
