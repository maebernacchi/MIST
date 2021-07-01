// server.js

//================= Load Modules =========================
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
LocalStrategy = require("passport-local").Strategy;
const database = require("./app/database");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "/../design-app")));

//================== Set View Engine =======================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);
app.use(flash());

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cookieParser(process.env.SECRET));

//=================== Setup Passport =======================
app.use(passport.initialize());
app.use(passport.session());
require("./app/passportConfig")(passport);

/*
Note: We commented the following four lines because they
contain database.User, and as of 7/17/20, we have not
reimplemented database.js, so it gives an error. Once
we reimplement database.js, these lines should be uncommented.

passport.serializeUser(database.User.serializeUser());
passport.deserializeUser(database.User.deserializeUser());
require('./app/loginStrategy')(passport, database.User);
require('./app/signupStrategy')(passport, database.User); */

//=================== Routes ================================
/*
Note: We commented the following four lines because they
contain database.User, and as of 7/17/20, we have not
reimplemented database.js, so it gives an error. Once
we reimplement database.js, these lines should be uncommented.

passport.serializeUser(database.User.serializeUser());
passport.deserializeUser(database.User.deserializeUser());
require('./app/loginStrategy')(passport, database.User);
require('./app/signupStrategy')(passport, database.User); */
//=================== Routes ================================
require("./app/routes")(app);

//=================== Serving Static Files ==================
//app.use(express.static("public"));

//Serve Static assets if we are in production mode
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
	});
}

const port = process.env.PORT || 8000;
app.listen(port);

console.log("App is listening on port " + port);
