const Accounts = require("./app/controllers/accounts");
const User = require("./app/controllers/user");
const Admin = require("./app/controllers/admin");
const Assets = require("./app/controllers/assets");

module.exports = [
  { method: "GET", path: "/", config: Accounts.main },
  { method: "POST", path: "/register/{admin}", config: Accounts.userRegister },
  { method: "GET", path: "/signup", config: Accounts.signup },
  { method: "GET", path: "/login", config: Accounts.login },
  { method: "POST", path: "/login", config: Accounts.authenticate },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "GET", path: "/settings", config: Accounts.viewSettings },
  { method: "POST", path: "/settings/update", config: Accounts.updateSettings },

  { method: "GET", path: "/home/admin", config: Admin.home },
  { method: "GET", path: "/admin/remuser/{email}", config: Admin.remUser },

  { method: "GET", path: "/home/user", config: User.home },
  { method: "GET", path: "/viewuser/{email}", config: User.viewUser },
  { method: "POST", path: "/home/addcache", config: User.addCache },
  { method: "GET", path: "/caches/deleteall", config: User.deleteAllCaches },
  { method: "POST", path: "/caches/deleteset", config: User.deleteCacheSet },
  { method: "POST", path: "/home/addmessage", config: User.addMessage },
  { method: "GET", path: "/messages/deleteall", config: User.deleteAllMessages },
  { method: "POST", path: "/messages/deleteset", config: User.deleteMessageSet },


  { method: "GET", path: "/home", config: Accounts.isAdmin },

  {
    method: "GET",
    path: "/{param*}",
    config: { auth: false },
    handler: Assets.servePublicDirectory
  }
];
