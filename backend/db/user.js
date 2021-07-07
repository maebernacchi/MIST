const User = require("../Models/User");
const pool = require("./dbconfig");
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
	let Special = ["!", "@"];
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
/**
 * Changes the password of the user
 *
 * @param {*} req
 * @param {*} callback
 */
module.exports.changePassword = async (req, callback) => {
	let dbPassword = "";
	await User.findOne({ _id: req.body._id }, (err, doc) => {
		if (err) {
			console.log("No doc");
			console.log(err);
		}
		dbPassword = doc.password;
	});
	bcrypt.compare(req.body.currentPassword, dbPassword, async (err, result) => {
		if (err) {
			callback(err);
		}
		if (result === false) {
			callback("Old Password Does Not Match");
		} else {
			if (passwordSecurity(req.body.newPassword) !== "Success") {
				callback(passwordSecurity(req.body.newPassword));
			} else {
				let newPass = await bcrypt.hash(req.body.newPassword, 12);
				User.findOneAndUpdate(
					{ _id: req.body._id },
					{ $set: { password: newPass } },
					{ new: true },
					(err, doc) => {
						if (err) {
							callback(err);
						} else {
							callback("Successfully Updated Password");
						}
					}
				);
			}
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
	User.updateOne(
		{ _id: req.user._id },
		{ $set: { email: sanitize(req.body.newEmail) } },
		{ new: true },
		(err, doc) => {
			if (err) {
				callback(err);
			} else {
				callback("Successfully Updated Email");
			}
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
module.exports.changeUsername = (req, callback) => {
	if (req.body.newUsername === "") callback("Username cannot be blank");
	else {
		User.find({ username: req.body.newUsername }, (err, docs) => {
			if (docs.length) {
				callback("Username already in use, try something else");
			} else {
				User.updateOne(
					{ _id: req.user._id },
					{ $set: { username: sanitize(req.body.newUsername) } },
					{ new: true },
					(err, doc) => {
						if (err) {
							callback(err);
						} else {
							callback("Successfully Updated Username");
						}
					}
				);
			}
		});
	}
};

/**
 * Changes the name of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the name was successfully updated or an error occurred
 */
module.exports.changeName = (req, callback) => {
	User.updateOne(
		{ _id: req.user._id },
		{
			$set: {
				forename: sanitize(req.body.newFirstName),
				surname: sanitize(req.body.newLastName),
			},
		},
		{ new: true },
		(err, doc) => {
			if (err) {
				callback(err);
			} else {
				callback("Successfully Updated Name");
			}
		}
	);
};

/**
 * Changes the bio of the user in the database
 *
 * @param {*} req
 * @param {*} callback
 * @returns a message if the bio was successfully updated or an error occurred
 */
module.exports.changeBio = (req, callback) => {
	User.updateOne(
		{ _id: req.user._id },
		{
			$set: {
				about: sanitize(req.body.newBio),
			},
		},
		{ new: true },
		(err, doc) => {
			if (err) {
				callback(err);
			} else {
				callback("Successfully Updated Bio");
			}
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
	User.updateOne(
		{ _id: req.user._id },
		{
			$set: {
				profilepic: sanitize(req.body.newProfilePic),
			},
		},
		{ new: true },
		(err, doc) => {
			if (err) {
				callback(err);
			} else {
				callback("Successfully Updated Profile Picture");
			}
		}
	);
};

// given a userId, returns the username
module.exports.getUsername = (userId, callback) => {
	User.findById(userId).exec((err, user) => {
		if (err) callback(null, err);
		else callback(user.username, null);
	});
};

/**
 * Deletes the user's account
 * @param {*} req
 * @param {*} callback
 */

module.exports.deleteAccount = async (req, callback) => {
	const is_active_user = pool.query(
		"select exists (select 1 from users where user_id='$1')",
		[req.body.user_id]
	);
	if (!is_active_user) {
		callback("User does not exist");
	}
	const dbPassword = pool.query(
		"select password from users where user_id='$1'",
		[req.body.user_id]
	);

	bcrypt.compare(req.body.currentPassword, dbPassword, (err, result) => {
		if (err) {
			console.log(err);
		}
		if (!result) {
			callback("Old Password Does Not Match");
		} else {
			pool.query("delete from users where user_id='$1'", [req.body.user_id]);
		}
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
	const is_duplicate_id = await pool.query(
		"select exists(select 1 from users where user_id='$1')",
		[user.user_id]
	);
	if (is_duplicate_id) callback("User ID Already taken");
	const is_duplicate_email = await pool.query(
		"select exists(select 1 from users where email='$1')",
		[user.email]
	);
	if (is_duplicate_email) callback("Email already registered");
	let passwordMessage = passwordSecurity(user.password);
	if (passwordMessage !== "Success") {
		callback(passwordMessage);
	}
	const hashedPassword = await bcrypt.hash(req.body.password, 12);
	const result = await pool.query(
		"insert into users (user_id, email, password) \
        values('$1', '$2', '$3')",
		[user.user_id, user.email, user.hashedPassword]
	);
	console.log(result);
	callback("User Created");
	//   User.findOne({ username: user.username }, async (err, doc) => {
	//     if (err) throw err;
	//     if (doc) callback("User Already Exists");
	//     if (!doc) {
	//       let passwordMessage = passwordSecurity(user.password);
	//       if (passwordMessage !== "Success") {
	//         callback(passwordMessage);
	//       } else {
	//         const hashedPassword = await bcrypt.hash(req.body.password, 12);
	//         const newUser = new User({
	//           forename: user.firstname,
	//           surname: user.lastname,
	//           username: user.username,
	//           password: hashedPassword,
	//           email: user.email,
	//           verified: false,
	//           admin: false,
	//           moderator: false,
	//           token: user.token,
	//         });
	//         await newUser.save();
	//         callback("User Created");
	//       }
	//     }
	//   });
};

// given a username, returns the userId
module.exports.getUserIdByUsername = (username, callback) => {
	User.findOne({ username: username }, (err, user) => {
		if (err) return callback(err, null);
		else return callback(null, user._id);
	});
};

// Returns all images and albums for the user's profile
module.exports.getCompletePersonalProfile = async (userid) => {
	userid = sanitize(userid);
	return User.findById(userid)
		.populate({
			path: "images",
			match: { active: true },
		})
		.populate({
			path: "albums",
			match: { active: true },
			populate: { path: "images", match: { active: true } },
		})
		.select("-password")
		.exec();
	//     .select('images albums')
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
