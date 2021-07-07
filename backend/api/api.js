/**
 * api.js
 *   Functions for handling requests to the API.
 */

// +-------+-----------------------------------------------------------
// | Notes |
// +-------+

/*
The API looks for actions specified by "funct" or "action" in
either GET or POST requests.  You should pass along the appropriate
object (body or whatever) to the run method, along with the request
and the response objects.  (Yes, the method needs a better name
than "run".)
In most cases, the handlers for the actions are found in
handlers.action (see the section about Handlers).  That way,
we can add another action to the API just by adding another
handler.
*/

// +--------------------+--------------------------------------------
// | Required Libraries |
// +--------------------+
require("dotenv").config();
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { handleError } = require("./utilities");
const signUp = require("./authentication");

// +--------------------+--------------------------------------------
// | Exported Functions |
// +--------------------+

/**
 * Run the API.
 */
module.exports.run = function (info, req, res) {
	// Support both Sam's and Alex's model of specifying what to do
	var action = info.action || info.funct;

	// Make sure that there's an action
	if (!action) {
		fail(res, "No action specified.");
	} // if there's no action

	// Deal with actions with a handler.
	else if (handlers[action]) {
		handlers[action](info, req, res);
	} // if (handlers[action])

	// Everything else is undefined
	else {
		handleError(res, "Invalid action: " + action);
	} // invalid action
}; // run

// +----------+--------------------------------------------------------
// | Handlers |
// +----------+

/**
 * The collection of handlers.
 */

// Note: Each handler should have parameters (info, req, res).

// Please keep each set of handlers in alphabetical order.
