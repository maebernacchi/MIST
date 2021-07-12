const User = require("../Models/User");
const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing
const { passwordStrength } = require("check-password-strength");
// https://www.npmjs.com/package/check-password-strength

// +------------+-------------------------------------------------
// |    Users   |
// +------------+

/**
 * Checks if the password is secure enough when the user is signing up
 */
const user_column = "user_id";
const email_column = "email";

// Determines if a user exists, given their username (user_id)
// Returns a boolean value
const checkRowExists = (column, value) => {
	pool
		.query("select exists (select 1 from users where $1=$2)", [column, value])
		.then((res) => {
			return res.rows[0].exists;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
};

/**
 * creates a new user in the database
 * @param req the request, must contain a user object
 * with user_id, email, password
 * @param callback returns if the user exists already or if the user was created succesfully
 */
module.exports.createUser = async (req, callback) => {
	let user = req.body;
	// check userid duplicate
	if (checkRowExists(user_column, user.user_id)) {
		callback("User ID Already taken.");
		return;
	}
	// check email duplicate
	if (checkRowExists(email_column, user.email)) {
		callback("Email already registered.");
		return;
	}

	const passwdStrength = passwordStrength(user.password);
	// 0 = Too weak
	// 1 = Weak
	// 2 = Medium
	// 3 = Strong
	if (passwdStrength.id <= 2) {
		callback(passwdStrength.value);
		return;
	}
	const hashedPassword = await bcrypt.hash(req.body.password, 12); // Hashes password
	pool
		.query(
			"insert into users (user_id, email, password, token) \
        values($1, $2, $3, $4)",
			[user.user_id, user.email, hashedPassword, user.token]
		)
		.then((res) => {
			callback(`User created with ID: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 *
 * Verify the email by looking up the token.
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.verifyEmail = (req, callback) => {
	pool
		.query(
			"update users set verified=true where token=$1", // If token matches, set user to verified
			[req.params.token]
		)
		.then((res) => {
			callback(`Email verified for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 *
 * Check if user's email is verified
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.checkEmailVerified = async (req) => {
	if (!checkRowExists(req.body.user_id)) {
		callback("User ID does not exist!");
	}
	pool
		.query("select verified from users where user_id=$1", [req.body.user_id])
		.then((res) => {
			return result.rows[0].verified;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 * Changes the password of the user
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.changePassword = async (req, callback) => {
	const user = req.body;
	let dbPassword = "";
	const result = await pool.query(
		"select password from users where user_id=$1",
		[user.user_id]
	);
	dbPassword = result.rows[0].password; // retrieve the hash of the current password
	bcrypt.compare(user.currentPassword, dbPassword, async (err, result) => {
		// compare the hash with the given password
		if (err) {
			callback(err);
		}
		if (result === false) {
			callback("Old Password Does Not Match");
		} else {
			let message = passwordSecurity(user.newPassword); // check security level of the new password
			if (message !== "Success") {
				callback(passwordSecurity(user.newPassword));
			}
			let newPass = await bcrypt.hash(user.newPassword, 12); // hashes new password
			pool
				.query("update users set password=$1 where user_id=$2", [
					newPass,
					user.user_id,
				])
				.then((res) => {
					callback(`Successfully updated password for user: ${user.user_id}`);
				})
				.catch((err) => {
					handleDBError(err, callback);
					return;
				});
		}
	});
};

/**
 * Changes the email of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the email was successfully updated or an error occurred
 */
module.exports.changeEmail = (req, callback) => {
	let user = req.body;
	pool
		.query("update users set email=$1 where user_id=$2", [
			user.email,
			user.user_id,
		])
		.then((res) => {
			callback(`Successfully updated email for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 * Changes the username of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the username is taken, was successfully updated, or an error occurred
 */
module.exports.changeUserId = (req, callback) => {
	if (req.body.new_user_id === "") callback("Username cannot be blank");
	else {
		if (checkRowExists(user_column, req.body.new_user_id)) {
			// Checks if the username is already in use
			console.log("Duplicate User ID");
			callback("User ID already in use!");
		} else {
			pool
				.query("update users set user_id=$1 where user_id=$2", [
					req.body.new_user_id,
					req.body.user_id,
				])
				.then((res) => {
					callback("User ID updated successfully.");
				})
				.catch((err) => {
					handleDBError(err, callback);
					return;
				});
		}
	}
};

/**
 * Changes the bio of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the bio was successfully updated or an error occurred
 */
module.exports.changeAbout = (req, callback) => {
	let user = req.body;
	let user_exists;
	if (!checkRowExists(user_column, user.user_id)) {
		callback("User does not exist.");
		return;
	}
	pool
		.query("update users set about = '$1' where user_id = '$2'", [
			user.newBio,
			user.user_id,
		])
		.then((res) => {
			callback(`Updated about description for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 *
 * @param {*} req
 * @param {*} callback
 * Changes the profile picture of the user in the database
 * Returns a message if the profile picture was succesfully updated or an error occured
 */
module.exports.changeProfilePic = (req, callback) => {
	let user = req.body;
	let user_exists;
	if (!checkRowExists(user_column, user.user_id)) {
		callback("User does not exist.");
		return;
	}
	pool
		.query("update users set profile_pic = $1 where user_id = $2", [
			user.newProfilePic,
			user.user_id,
		])
		.then((res) => {
			callback(`Updated profile picture for user: ${user.user_id}`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 *
 * Deletes the user's account
 * @param {*} req
 * @param {*} callback
 */

module.exports.deleteAccount = async (req, callback) => {
	let user = req.body;
	let dbPassword = "";
	if (!checkRowExists(user_column, user.user_id)) {
		callback("User does not exist.");
		return;
	}
	const result = await pool
		.query("select password from users where user_id=$1", [req.body.user_id])
		.then((res) => {
			dbPassword = res.rows[0].password;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	bcrypt.compare(req.body.password, dbPassword, (err, result) => {
		// checks password before deleting
		if (err) {
			console.log(err);
		}
		if (result === false) {
			callback("Password incorrect.");
		} else {
			pool
				.query("delete from users where user_id=$1", [user.user_id])
				.then((res) => {
					callback("Deleted user.");
				})
				.catch((err) => {
					handleDBError(err, callback);
					return;
				});
		}
	});
};

// Returns all images for the user's own profile
// TODO: have it check for user_id so it can be used for personal profile and other profiles
// 		  (only difference is other profiles only retrieve public images)
module.exports.getCompleteUserProfile = async (req, callback) => {
	let user = req.body;
	let is_active_user;
	pool
		.query("select exists (select 1 from users where user_id=$1)", [
			user.user_id,
		])
		.then((res) => (is_active_user = res.rows[0].exists))
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
	if (!is_active_user) {
		callback("User does not exist.");
	}
	pool
		.query(
			"select code, created_at, likes, comments from posts \
		inner join users on posts.user_id = users.user_id \
		where user_id = $1",
			[user.user_id]
		)
		.then((res) => {
			return res.rows[0];
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

// TODO: Make a second function like the one above but for retrieving all collections from a user

// NOTE: Unneccessary Function, likely to be truncated later
// Returns all images and albums for viewing another user's profile
// module.exports.getCompleteUserProfile = async (userid) => {
// 	userid = sanitize(userid);
// 	return User.findById(userid)
// 		.populate({
// 			path: "images",
// 			match: {
// 				active: true,
// 				public: true,
// 			},
// 		})
// 		.populate({
// 			path: "albums",
// 			match: {
// 				active: true,
// 				public: true,
// 			},
// 			populate: {
// 				path: "images",
// 				match: {
// 					active: true,
// 					public: true,
// 				},
// 			},
// 		})
// 		.select("-password")
// 		.exec();
// };

// TODO In the future, parse the error code.
const handleDBError = (err, callback) => {
	console.error(err);
	callback("Unknown Database error.");
	return;
};
// //https://www.reddit.com/r/node/comments/ku7rji/is_there_a_better_way_to_handle_postgres_database/giqvi3h?utm_source=share&utm_medium=web2x&context=3
// const handleDBError = (err, callback) => {
// 	console.error(err);
// 	const errors = {
// 		UniqueViolationError: {
// 			code: 23505,
// 			message: (field) => `${field} already exists.`,
// 		},
// 	};
// 	if (err.code === errors.UniqueViolationError.code) {
// 		callback(errors.UniqueViolationError.message(err.internalQuery));
// 		return;
// 	}
// 	callback(message);
// };
