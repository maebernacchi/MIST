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
const checkUserExists = (user_id) => {
	pool.query(
		"select exists (select 1 from users where user_id=$1)",
		[user_id],
		(err, result) => {
			// database error
			if (err) {
				console.log(err);
				callback(err);
				return;
			}
			return result.rows.exists;
		}
	);
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
	if (checkUserExists(user.user_id)) {
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
		"insert into users (user_id, email, password) \
        values($1, $2, $3)",
		[user.user_id, user.email, hashedPassword],
		(err, res) => {
			if (err) {
				callback(err);
				console.log(err);
				return;
			}
			console.log(res);
			callback("User Created");
			return;
		}
	);
};

/**
 * Changes the password of the user
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.changePassword = async (req, callback) => {
	let dbPassword = "";
	pool.query(
		"select password from users where user_id='$1'",
		[req.body.user_id],
		(err, result) => {
			if (err) throw err;
			dbPassword = result;
		}
	);
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
				"update users set password='$1' where user_id='$2'",
				[newPass, req.body.user_id],
				(err, result) => {
					if (err) throw err;
					console.log(result);
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
	// TODO figure out if it's req or req.body
	let user = req.body;
	pool.query(
		"update users set email='$1' where user_id='$2'",
		[user.email, user.user_id],
		(err, res) => {
			if (err) throw err;
			console.log(res);
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
				"update users set user_id='$1' where user_id='$2'",
				[req.new_user_id, req.user_id],
				(err, res) => {
					if (err) throw err;
					console.log(result);
					callback(`User ID updated successfully`);
				}
			);
		}
	}
};

/**
 * Changes the name of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the name was successfully updated or an error occurred
 */
module.exports.changeFullname = (req, callback) => {
	let user = req.body;
	pool.query("select exists (select 1 from users where user_id='$1')", [
		user.user_id,
	]);
	if (!user_exists) {
		callback("User does not exist");
	}
	pool.query("update users set fullname = $1 where user_id = $2", [
		user.newBio,
		user.user_id,
	]);
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
	pool.query(
		"select password from users where user_id='$1'",
		[user.user_id],
		(err, res) => {
			if (err) throw err;
			dbPassword = res;
			console.log(res);
		}
	);

	bcrypt.compare(req.body.currentPassword, dbPassword, (err, result) => {
		if (err) {
			console.log(err);
		}
		if (!result) {
			callback("Old Password Does Not Match");
		} else {
			pool.query(
				"delete from users where user_id='$1'",
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
