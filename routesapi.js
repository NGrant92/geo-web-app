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
    config: CachesApi.findAll
  },
  {
    method: "GET",
    path: "/api/caches/{id}",
    config: CachesApi.findOne
  },
  {
    method: "GET",
    path: "/api/caches/following",
    config: CachesApi.findFolloweeCaches
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
    path: "/api/following/followers/{id}",
    config: FollowingApi.findFollowers
  },
  {
    method: "GET",
    path: "/api/following/followees/{id}",
    config: FollowingApi.findFollowees
  },
  {
    method: "POST",
    path: "/api/following",
    config: FollowingApi.create
  },
  {
    method: "DELETE",
    path: "/api/following/{id}",
    config: FollowingApi.unfollow
  },
];
