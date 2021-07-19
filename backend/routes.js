const pool = require("./db/dbconfig");
const api = require("./api/api");
const database = require("./app/database");
const { verifyEmail } = require("./db/user");
const collectionRoute = require("./api/collection");
const galleryRoute = require("./api/gallery");
const userRoute = require("./api/user");
const postRoute = require("./api/post");
const reportRoute = require("./api/report");
const workspaceRoute = require("./api/workspace");

module.exports = (app) => {
	app.use("/api/collections", collectionRoute);
	app.use("/api/galleries", galleryRoute);
	app.use("/api/posts", postRoute);
	app.use("/api/reports", reportRoute);
	app.use("/api/users", userRoute);
	app.use("/api/workspaces", workspaceRoute);
	
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
};
