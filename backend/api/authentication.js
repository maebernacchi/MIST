const handlers = require("./api");
var database = require("../db/database.js");
const { sign } = require("crypto");
// +------------------+--------------------------------------------------
// | Authentication   |
// +------------------+

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

/**
 * Verifies that the email address is correct
 * @param {*} info
 * @param {*} req
 * @param {*} res
 */
handlers.verifyEmail = function (info, req, res) {
	database.User.findOneAndUpdate(
		{ token: req.body.token },
		{ $set: { verified: true } },
		{ new: true },
		(err, doc) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Success");
			}
		}
	);
};

/*
 *   Register user to the database
 *   info.action: signup
 */
//handlers.signUp
const signUp = async function (info, req, res) {
	req.body.token = await crypto.randomBytes(32).toString("hex");

	let transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: process.env.GMAILID, // generated ethereal user
			pass: process.env.GMAILPASS, // generated ethereal password
		},
	});

	const PUBLIC_IP = process.env.PUBLIC_IP || "http://localhost:3000";
	let mail = {
		from: process.env.GMAILID,
		to: req.body.email,
		subject: "Email Verification",
		text:
			"Greetings from MIST!" +
			"\n\n" +
			"Please use the following link to verify your account:" +
			"\n\n" +
			`${PUBLIC_IP}/emailVerification/${req.body.token}`,
	};

	database.createUser(req, (message) => {
		if (message === "User Created") {
			transporter.sendMail(mail, (err, data) => {
				if (err) {
					console.log(err);
					res.json(err);
				} else {
					console.log("Sent!");
					res.json(message);
				}
			});
		} else {
			res.json(message);
		}
	});
};

module.exports.signUp = signUp;

/*
 *   Log user in
 *   info.action: signIn
 */

handlers.signIn = async function (info, req, res, next) {
	let emailVerify = false;
	await database.User.findOne({ username: req.body.username }, (err, user) => {
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
handlers.signOut = function (info, req, res) {
	req.logout();
	res.json("Success");
};

/*
 *   Get user from Passport
 *   info.action: getUser
 */
handlers.getUser = function (info, req, res) {
	if (!req.user) res.json(null);
	else {
		// we have to search the database for the full user
		// because passport only stores the username of the person logged in
		database.User.findOne({ username: req.user.username }, (err, user) => {
			if (err) fail(res, "no user found");
			else res.json(user);
		});
	}
};

/** */
handlers.getAuthenticatedCompletePersonalProfile = async function (
	info,
	req,
	res
) {
	try {
		if (!req.isAuthenticated()) throw "Unauthenticated Guest";
		const userid = req.user._id;
		const complete_user = await database.getCompletePersonalProfile(userid);
		res.json({
			user: complete_user,
		});
	} catch (error) {
		fail(res, error);
	}
};

/** */
handlers.getAuthenticatedCompleteUserProfile = async function (info, req, res) {
	try {
		if (!req.isAuthenticated()) throw "You need to login to view a profile!";
		const userid = info.userid;
		const complete_user = await database.getCompleteUserProfile(userid);
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
handlers.deleteAuthorizationCheck = async function (info, req, res) {
	try {
		const { userId, model, objectId } = info;
		const updateAuthorization = database.updateAuthorizationCheck(
			userId,
			model,
			objectId
		);
		const adminOrModerator = database.isAdminOrModerator(userId);
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
handlers.updateAuthorizationCheck = async function (info, req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in!",
		});
	} else {
		try {
			const { userId, model, objectId } = info;
			const authorized = Boolean(
				await database.updateAuthorizationCheck(userId, model, objectId)
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
