// server.js

//================= Load Modules =========================
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
LocalStrategy = require("passport-local").Strategy;
const database = require('./app/database');
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/../design-app')));

//================== Set View Engine =======================

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());

app.use(
  session({
    secret: "some",
    resave: false,
    saveUninitialized: false
  })
);

//=================== Setup Passport =======================
app.use(passport.initialize());
app.use(passport.session());

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
require('./app/routes')(app, passport, database);

//=================== Serving Static Files ==================
//app.use(express.static("public"));

const port = process.env.PORT || 8000;
app.listen(port);

console.log('App is listening on port ' + port);
