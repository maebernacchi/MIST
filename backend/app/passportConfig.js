/***************************************************************************************
*    Title: passportConfig from passport-local-video
*    Author: woodburydev
*    Date: May, 2020
*    Code version: 1
*    Availability: https://github.com/woodburydev/passport-local-video/blob/master/backend/passportConfig.js
*
***************************************************************************************/

const database = require("./database");
const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      database.User.findOne({ username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  
  passport.deserializeUser((id, cb) => {
    database.User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        _id: user._id,
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};
