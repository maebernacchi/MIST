/***************************************************************************************
 *    Title: passportConfig from passport-local-video
 *    Author: woodburydev
 *    Date: May, 2020
 *    Code version: 1
 *    Availability: https://github.com/woodburydev/passport-local-video/blob/master/backend/passportConfig.js
 *
 ***************************************************************************************/

const bcrypt = require("bcrypt");
const localStrategy = require("passport-local").Strategy;
const pool = require("../db/dbconfig");

module.exports = function (passport) {
	/*
		Here the authentication strategy for Passport to use is set up.
		Basically we have set it to search for the user with the given username, and compare passwords to log in.
	*/
	passport.use(
		new localStrategy( // sets up the authentication strategy for passport to use
			{
				usernameField: "user_id",
				passwordField: "password",
			},
			(userId, password, done) => {
				// pool
				// 	.query("select * from users where user_id=$1", [userId])
				// 	.then((result) => {
				// 		const user = result.rows[0];
				// 		bcrypt.compare(user.password, password, (err, result) => {
				// 			if (err) throw err;
				// 			if (result === true) {
				// 				return done(null, user);
				// 			} else {
				// 				return done(null, false);
				// 			}
				// 		});
				// 	})
				// 	.catch((err) => console.error(err));
				pool.query(
					"select * from users where user_id=$1",
					[userId],
					(err, result) => {
						if (err) {
							throw err;
						}
						const user = result.rows[0];
						bcrypt.compare(password, user.password, (err, result) => {
							if (err) {
								throw err;
							}
							if (result === true) {
								return done(null, user);
							} else {
								return done(null, false);
							}
						});
					}
				);
			}
		)
	);

	// Info from: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
	// This method passes the user's user id to its callback function. In effect, it is meant to "persist user data into a session"
	// This is done after successful authentication
	passport.serializeUser((user, done) => {
		done(null, user.user_id);
	});

	// This method retrieves data from the current session
	passport.deserializeUser((id, done) => {
		pool.query("select * from users where user_id=$1", [id], (err, result) => {
			done(err, result.rows[0]);
		});
	});
};
