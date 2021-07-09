const User = require("../Models/User");
const pool = require("./dbconfig");
const bcrypt = require("bcrypt");
// +------------+-------------------------------------------------
// |    Users   |
// +------------+

/**
 * Checks if the password is secure enough when the user is signing up
 */
passwordSecurity = (pass) => {
	let digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	let checkNumber = false;
	let checkSpecial = false;
	let Special = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
	if (pass.length < 8) {
		return "Required: At least 8 characters";
	}
	for (let i = 0; i < Special.length; i++) {
		if (pass.includes(Special[i])) {
			checkSpecial = true;
		}
	}
	for (let i = 0; i < digits.length; i++) {
		if (pass.includes(digits[i])) {
			checkNumber = true;
		}
	}
	if (!checkSpecial) {
		return "Required: At least one special character";
	} else if (!checkNumber) {
		return "Required: At least one digit";
	} else {
		return "Success";
	}
};

// TODO make it applic`able to email
const checkUserExists = async (user_id) => {
	const result = await pool.query(
		"select exists (select 1 from users where user_id=$1)",
		[user_id]
	);
	return result.rows[0].exists;
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
	if (await checkUserExists(user.user_id)) {
		callback("User ID Already taken");
		return;
	}
	// check email duplicate
	pool.query(
		"select exists(select 1 from users where email=$1)",
		[user.email],
		(err, res) => {
			if (err) {
				callback(err);
				return;
			}
			if (res.rows.exists) {
				callback("Email already registered.");
				return;
			}
		}
	);
	let passwordMessage = passwordSecurity(user.password);
	if (passwordMessage !== "Success") {
		callback(passwordMessage);
		return;
	}
	const hashedPassword = await bcrypt.hash(req.body.password, 12);
	pool.query(
		"insert into users (user_id, email, password, token) \
        values($1, $2, $3, $4)",
		[user.user_id, user.email, hashedPassword, user.token],
		(err, res) => {
			if (err) {
				callback(err);
				console.log(err);
				return;
			}
			callback("User Created");
			return;
		}
	);
};

/**
 *
 * Verify the email by looking up the token.
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.verifyEmail = (req, callback) => {
	pool.query(
		"update users set verified=true where token=$1",
		[req.params.token],
		(err, res) => {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback("Email Verified");
			}
		}
	);
};

/**
 *
 * Check if user's email is verified
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.checkEmailVerified = async (req) => {
	if (!checkUserExists(req.body.user_id)) {
		callback("User ID does not exist!");
	}
	const result = await pool.query(
		"select verified from users where user_id=$1",
		[req.body.user_id]
	);
	return result.rows[0].verified;
};

/**
 * Changes the password of the user
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.changePassword = async (req, callback) => {
	let dbPassword = "";
	// await pool.query(
	// 	"select password from users where user_id=$1",
	// 	[req.body.user_id],
	// 	(err, result) => {
	// 		if (err) {
	// 			callback(err);
	// 			return;
	// 		}
	// 		console.log(result.rows[0].password);
	// 		dbPassword = result.rows[0].password;
	// 	}
	// );
	const result = await pool.query(
		"select password from users where user_id=$1",
		[req.body.user_id]
	);
	dbPassword = result.rows[0].password;
	bcrypt.compare(req.body.currentPassword, dbPassword, async (err, result) => {
		if (err) {
			callback(err);
		}
		if (result === false) {
			callback("Old Password Does Not Match");
		} else {
			let message = passwordSecurity(req.body.newPassword);
			if (message !== "Success") {
				callback(passwordSecurity(req.body.newPassword));
			}
			let newPass = await bcrypt.hash(req.body.newPassword, 12);
			pool.query(
				"update users set password=$1 where user_id=$2",
				[newPass, req.body.user_id],
				(err, result) => {
					if (err) {
						callback(err);
						return;
					}
					callback(
						`Successfully updated password of user: ${req.body.user_id}`
					);
				}
			);
			// TODO error handling
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
	pool.query(
		"update users set email=$1 where user_id=$2",
		[user.email, user.user_id],
		(err, res) => {
			if (err) throw err;
			callback(`Successfully Updated Email for user ${user.user_id}`);
		}
	);
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
		if (checkUserExists(req.body.new_user_id)) {
			console.log("duplicate user_id");
			callback("User ID already in use!");
		} else {
			pool.query(
				"update users set user_id=$1 where user_id=$2",
				[req.body.new_user_id, req.body.user_id],
				(err, res) => {
					if (err) {
						callback(err);
					} else {
						callback(`User ID updated successfully`);
					}
				}
			);
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
	pool.query(
		"select exists (select 1 from users where user_id='$1')",
		[user.user_id],
		(err, res) => {
			if (err) throw err;
			user_exists = res;
		}
	);
	if (!user_exists) {
		callback("User does not exist");
	}
	pool.query(
		"update users set about = '$1' where user_id = '$2'",
		[user.newBio, user.user_id],
		(err, res) => {
			if (err) throw err;
			console.log(res);
			callback(`Updated the about description for user: ${user.user_id}`);
		}
	);
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
	if (!checkUserExists(user.user_id)) {
		callback("User does not exist");
		return;
	}
	pool.query(
		"update users set profile_pic = $1 where user_id = $2",
		[user.newProfilePic, user.user_id],
		(err, res) => {
			if (err) throw err;
			console.log(res);
			callback(`Updated profile picture for user: ${user.user_id}`);
		}
	);
};

// UPDATE: since username is now unique, userId has merged into it and this method is now no longer usable
// given a userId, returns the username
/** 
module.exports.getUsername = (userId, callback) => {
	User.findById(userId).exec((err, user) => {
		if (err) callback(null, err);
		else callback(user.username, null);
	});
};*/

/**
 * Deletes the user's account
 * @param {*} req
 * @param {*} callback
 */

module.exports.deleteAccount = async (req, callback) => {
	let user = req.body;
	let dbPassword = "";
	if (!checkUserExists(user.user_id)) {
		callback("User does not exist");
	}
	const result = await pool.query(
		"select password from users where user_id=$1",
		[req.body.user_id]
	);
	dbPassword = result.rows[0].password;

	bcrypt.compare(req.body.password, dbPassword, (err, result) => {
		if (err) {
			console.log(err);
		}
		if (result === false) {
			callback("Password incorrect.");
		} else {
			pool.query(
				"delete from users where user_id=$1",
				[user.user_id],
				(err, res) => {
					if (err) throw err;
					console.log(res);
					callback(`Deleted user!`);
				}
			);
		}
	});
};

// given a username, returns the userId
// UPDATE: since username is now unique, userId has merged into it and this method is now no longer usable
/**module.exports.getUserIdByUsername = (username, callback) => {
	const username_exists = pool.query("select exists (select 1 from users where")
	
	User.findOne({ username: username }, (err, user) => {
		if (err) return callback(err, null);
		else return callback(null, user._id);
	});
};**/

// Returns all images and albums for the user's profile
module.exports.getCompletePersonalProfile = async (req, callback) => {
	let user = req.body;
	const is_active_user = pool.query(
		"select exists (select 1 from users where user_id='$1')",
		[user.user_id]
	);
	if (!is_active_user) {
		callback("User does not exist");
	}
	pool.query(
		"select code, created_at, likes, comments from posts \
		inner join users on posts.user_id = users.user_id \
		where user_id = $1",
		[user.user_id]
	);
};

// Returns all images and albums for viewing another user's profile
module.exports.getCompleteUserProfile = async (userid) => {
	userid = sanitize(userid);
	return User.findById(userid)
		.populate({
			path: "images",
			match: {
				active: true,
				public: true,
			},
		})
		.populate({
			path: "albums",
			match: {
				active: true,
				public: true,
			},
			populate: {
				path: "images",
				match: {
					active: true,
					public: true,
				},
			},
		})
		.select("-password")
		.exec();
};
