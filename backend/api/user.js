const { handleError } = require("./utilities.js");
var database = require("../db/database.js");
const crypto = require("crypto");
const userDB = require("../db/user.js");
const nodemailer = require("nodemailer");
// +------------------+--------------------------------------------------
// | Users            |
// +------------------+

const userRoute = (req, res, next) => {
	let action;
	if (req.method == "POST") {
		action = req.body.action || req.body.funct;
	} else if (req.method == "GET") {
		action = req.query.action || req.query.funct;
	}
	if (!action) {
		handleError(res, "No action specified.");
	}
	if (userHandlers[action]) {
		userHandlers[action](req, res);
	} else {
		handleError(res, `Invalid Action: ${action}`);
	}
};

var userHandlers = {};

/*
 *   Register user to the database
 *   info.action: signup
 */
userHandlers.signUp = async function (req, res) {
	// req.body.token = await crypto.randomBytes(32).toString("hex");
	const token = crypto.randomBytes(32).toString("hex");
	req.body.token = token;

	const transporter = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "1c313a50587f94",
			pass: "cd4678221c841c",
		},
	});

	const PUBLIC_IP = process.env.PUBLIC_IP || "http://localhost:8000";
	let mail = {
		from: "smtp.mailtrap.io",
		// from: process.env.GMAILID,
		to: req.body.email,
		subject: "MIST Email Verification",
		text:
			"Greetings from MIST!" +
			"\n\n" +
			"Please use the following link to verify your account:" +
			"\n\n" +
			`${PUBLIC_IP}/emailVerification/${token}`,
	};

	userDB.createUser(req, (message) => {
		if (message === "User Created") {
			transporter.sendMail(mail, (err, data) => {
				if (err) {
					res.json(err);
					return;
				} else {
					console.log("Sent!");
					res.json(message);
					return;
				}
			});
		} else {
			res.json(message);
			return;
		}
	});
};

/*
 *   Log user in
 *   info.action: signIn
 */
// TODO move to database
userHandlers.signIn = async function (req, res, next) {
	let emailVerify = false;
	await userDB.User.findOne({ username: req.body.username }, (err, user) => {
		if (err) {
			console.log(err);
		} else if (user) {
			emailVerify = user.verified;
			if (!emailVerify) {
				res.json("Please Verify Email");
			} else {
				try {
					passport.authenticate("local", (err, user, info) => {
						if (err) {
							throw err;
						}
						if (!user) {
							res.json("No User Exists");
						} else {
							req.logIn(user, (err) => {
								if (err) throw err;
								var message = "Success";
								res.json(message);
							});
						}
					})(req, res, next);
				} catch (error) {
					console.log(error);
				}
			}
		} else {
			res.json("No User Exists");
		}
	});
};

/*
 *   Log user out
 *   info.action: signOut
 */
userHandlers.signOut = function (req, res) {
	req.logout();
	res.json("Success");
};

/*
 *   Get user from Passport
 *   info.action: getUser
 */
// TODO move to database
userHandlers.getUser = function (req, res) {
	if (!req.user) res.json(null);
	else {
		// we have to search the database for the full user
		// because passport only stores the username of the person logged in
		userDB.User.findOne({ username: req.user.username }, (err, user) => {
			if (err) fail(res, "no user found");
			else res.json(user);
		});
	}
};

/** */
userHandlers.getAuthenticatedCompletePersonalProfile = async function (
	req,
	res
) {
	try {
		if (!req.isAuthenticated()) throw "Unauthenticated Guest";
		const userid = req.user._id;
		const complete_user = await userDB.getCompletePersonalProfile(userid);
		res.json({
			user: complete_user,
		});
	} catch (error) {
		fail(res, error);
	}
};

/** */
userHandlers.getAuthenticatedCompleteUserProfile = async function (req, res) {
	try {
		if (!req.isAuthenticated()) throw "You need to login to view a profile!";
		const userid = info.userid;
		const complete_user = await userDB.getCompleteUserProfile(userid);
		res.json({
			user: complete_user,
		});
	} catch (error) {
		fail(res, error);
	}
};

/**
 * Determines whether or not a user is authorized to Delete an object (album, image, etc...)
 */
userHandlers.deleteAuthorizationCheck = async function (req, res) {
	try {
		const { userId, model, objectId } = info;
		const updateAuthorization = userDB.updateAuthorizationCheck(
			userId,
			model,
			objectId
		);
		const adminOrModerator = userDB.isAdminOrModerator(userId);
		Promise.all([updateAuthorization, adminOrModerator]).then((values) => {
			res.json({
				success: true,
				authorized: values[0] || values[1],
			});
		});
	} catch (error) {
		res.json({
			success: false,
			authorized: false,
		});
	}
};

/**
 * Determines whether or not a user is authorized to Update an object (album, image, etc...)
 */
userHandlers.updateAuthorizationCheck = async function (req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in!",
		});
	} else {
		try {
			const { userId, model, objectId } = info;
			const authorized = Boolean(
				await userDB.updateAuthorizationCheck(userId, model, objectId)
			);
			res.json({
				success: true,
				authorized: authorized,
			});
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

userHandlers.changeEmail = function (req, res) {
	userDB.changeEmail(req, (message) => res.json(message));
};

userHandlers.changeUserId = function (req, res) {
	userDB.changeUserId(req, (message) => res.json(message));
};

userHandlers.changePassword = function (req, res) {
	userDB.changePassword(req, (message) => res.json(message));
};

userHandlers.deleteAccount = function (req, res) {
	userDB.deleteAccount(req, (message) => {
		req.logout();
		res.json(message);
	});
};

userHandlers.changeBio = function (req, res) {
	userDB.changeBio(req, (message) => res.json(message));
};

userHandlers.changeProfilePic = function (req, res) {
	userDB.changeProfilePic(req, (message) => res.json(message));
};

// https://stackoverflow.com/questions/38820251/how-is-req-isauthenticated-in-passport-js-implemented
function checkAuthentication(request, response, next) {
	if (request.isAuthenticated()) {
		//req.isAuthenticated() will return true if user is logged in
		next();
	} else {
		// This is the jsend response status for rejected API call
		const responseStatus = "fail";
		// This is the unauthorized/unauthenticated HTTP response status code
		const responseStatusCode = 401;
		const data = { Authentication: "You need to be logged in!" };
		dispatchResponse(response, responseStatus, responseStatusCode, data);
	}
}

module.exports = userRoute;
