const session = require("express-session");
const env = require("./env");
const FileSessionStore = require("./sessionStore");

module.exports = session({
  name: "royalcity.sid",
  store: new FileSessionStore(),
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
