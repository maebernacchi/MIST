const pool = require("../db/dbconfig");
const api = require("../api/api");
const database = require("./database");
const users = require("../api/user.js");
const { verifyEmail } = require("../db/user");

module.exports = (app) => {
	app.use("/api/users", users);
	// Our stuff
	// ROUTES
	// create

	/*
		Users post request
		Inserts new user data into the table
	*/
	app.post("/users", async (req, res) => {
		try {
			const { user_id, email, password } = req.body; // pulling values from the request body
			const newUser = await pool.query(
				"insert into users(user_id, email, password) values ($1, $2, $3)",
				[user_id, email, password] // plugging those values into the database
			);
			res.json(newUser);
		} catch (error) {
			console.error(error.message);
		}
	});

	// read

	/*
		Users get request
		Retrieves all user data from the table
	*/
	app.get("/users", async (req, res) => {
		try {
			// const allUsers = await pool.query("select * from users");
			// res.json(allUsers.rows);
			pool.query("select * from users", (err, result) => { // select all data from users
				if (err) throw err;
				res.json(result.rows);
			});
		} catch (error) {
			console.error(error.message);
		}
	});

	/*
		Retrieves specific user data from the table
	*/
	app.get("/users/:user_id", async (req, res) => {
		try {
			const { user_id } = req.params; // user id taken from request body
			const user = await pool.query("select * from users where user_id = $1", [
				user_id,
			]);
			res.json(user.rows[0]);
		} catch (error) {
			console.error(error.message);
		}
	});

	// update

	/*
		Users put request
		Updates user data
	*/
	app.put("/users/:id", async (req, res) => {
		try {
			const { id } = req.params; // current user id
			const { user_id, email, password } = req.body; // new user info
			const updateUser = await pool.query(
				"update users set (user_id, email, password)=($1, $2, $3) where user_id=$4",
				[user_id, email, password, id]
			);
			res.json("User updated!");
		} catch (error) {
			console.error(error.message);
		}
	});

	// delete

	/*
		Users delete request
		Deletes user data from the table
	*/
	app.delete("/users/:user_id", async (req, res) => {
		try {
			const { user_id } = req.params; // user to delete
			const deleteUser = await pool.query(
				"delete from users where user_id=$1",
				[user_id]
			);
			res.json("User deleted!");
		} catch (error) {
			console.error(error.message);
		}
	});

	// Path: /api
	//  Dynamic content distribution - return raw data through Fetch

	app.post("/api", function (req, res) {
		api.run(req.body, req, res);
	});
	app.get("/api", function (req, res) {
		api.run(req.query, req, res);
	});
	//------------------------------------------------

	app.get("/api/profiles/:username", (req, res) => {
		const username = req.params.username;
		const user = database.User.findOne({ username: username });
		//const user = null;
		if (user === null) {
			user = {
				forename: "shrek",
				surname: "the ogre",
				username: "theShrekster",
				createdAt: new Date().toDateString(),
				about: "first the worst, shrek the best",
				profilepic: "sin(x)",
			};
		}

		const userImages = [
			{
				id: 0,
				title: "image1",
				url: "image1",
				description: "",
				rating: 4,
				username: "@shrek",
				isAnimated: true,
				code: "wsum(sin(x), cos(y))",
				comments: "",
			},
			{
				id: 1,
				title: "image2",
				url: "image2",
				description: "",
				rating: 10,
				username: "@shrek",
				isAnimated: false,
				code: "cos(x)",
				comments: "",
			},
			{
				id: 2,
				title: "image3",
				url: "image3",
				rating: 10,
				username: "@shrek",
				isAnimated: true,
				code: "mult(cos(y),y)",
				comments: "",
			},
		];

		const userAlbums = [
			{
				name: "my images",
				images: userImages,
				createdAt: new Date().toDateString(),
				caption: "best album ever",
			},
			{
				name: "my favorites",
				images: userImages,
				createdAt: new Date().toDateString(),
				caption: "my favorite images to date",
			},
		];

		const userInfo = {
			user: user,
			userImages: userImages,
			userAlbums: userAlbums,
		};
		res.json(userInfo);
	});

	// provides user information needed for profile page
	// trying to match the userSchema,
	// but only choose the ones we are using currently for the profile
	app.get("/api/profile", (req, res) => {
		var user = {
			forename: "shrek",
			surname: "the ogre",
			username: "theShrekster",
			createdAt: new Date().toDateString(),
			about: "first the worst, shrek the best",
			profilepic: "sin(x)",
		};

		var userImages = [
			{
				id: 0,
				title: "image1",
				url: "image1",
				description: "",
				rating: 4,
				username: "@shrek",
				isAnimated: true,
				code: "wsum(sin(x), cos(y))",
				comments: "",
			},
			{
				id: 1,
				title: "image2",
				url: "image2",
				description: "",
				rating: 10,
				username: "@shrek",
				isAnimated: false,
				code: "cos(x)",
				comments: "",
			},
			{
				id: 2,
				title: "image3",
				url: "image3",
				rating: 10,
				username: "@shrek",
				isAnimated: true,
				code: "mult(cos(y),y)",
				comments: "",
			},
		];

		var userAlbums = [
			{
				name: "my images",
				images: userImages,
				createdAt: new Date().toDateString(),
				caption: "best album ever",
			},
			{
				name: "my favorites",
				images: userImages,
				createdAt: new Date().toDateString(),
				caption: "my favorite images to date",
			},
		];

		var userInfo = {
			user: user,
			userImages: userImages,
			userAlbums: userAlbums,
		};
		res.json(userInfo);
	});

	// app.post("/api/emailVerification/:username", (req, res) => {
	// 	console.log(req.params.username);
	// });


	/*
		Email Verification Route
		Runs when user clicks the link sent to their email
		The user's token is sent to verifyEmail and checked
	*/
	app.get("/emailVerification/:token", (req, res) => {
		verifyEmail(req, (message) => {
			if (message == "Email Verified") {
				console.log("Email verification success!");
				res.json(message);
			} else {
				console.error(message);
				res.json(message);
			}
		});
	});

	/**
	 * Verifies that the email address is correct
	 * @param {*} info
	 * @param {*} req
	 * @param {*} res
	 */
	// userHandlers.verifyEmail = function (req, res) {
		
	// };
};
