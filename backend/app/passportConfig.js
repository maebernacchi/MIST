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
	passport.use(
		new localStrategy(
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

	passport.serializeUser((user, done) => {
		done(null, user.user_id);
	});

	passport.deserializeUser((id, done) => {
		pool.query("select * from users where user_id=$1", [id], (err, result) => {
			done(err, result.rows[0]);
		});
	});
};
