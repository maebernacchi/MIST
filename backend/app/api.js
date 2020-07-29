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

var database = require('./database.js');
const passport = require("passport");


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
    fail(res, "Invalid action: " + action);
  } // invalid action
} // run

// +-----------+-------------------------------------------------------
// | Utilities |
// +-----------+

/**
 * Indicate that the operation failed.
 */
fail = function (res, message) {
  console.log("FAILED!", message);
  res.status(400).send(message);       // "Bad request"
} // fail

// +----------+--------------------------------------------------------
// | Handlers |
// +----------+

/**
 * The collection of handlers.
 */
var handlers = {};

// Note: Each handler should have parameters (info, req, res).

// Please keep each set of handlers in alphabetical order.

// +----------------+--------------------------------------------------
// | Image Handlers |
// +----------------+

/**
 * Check if an image exists (should be imagetitleexists)
 *   info.action: imageexists
 *   info.title: The title of the image
 */
handlers.imageexists = function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.send("logged out");
  } else {
    let exists = false;
    const arr = req.user.images.slice();
    arr.forEach((image) => {
      if (image.title === info.title) {
        exists = true;
        return;
      };
    });
    res.send(exists);
  }
};

/**
 *   Get featured images for home pages
 *   info.action: getHomeImages
 */

handlers.getHomeImages = function (info, req, res) {
  database.getFeaturedImagesLoggedOut(4, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  })
}

// +----------------+--------------------------------------------------
// | Gallery        |
// +----------------+

/**
 *   Get 9 random public images
 *   info.action: getRandomImages
 */

handlers.getRandomImages = function (info, req, res) {
  database.getRandomImagesLoggedOut(9, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  })
}

/**
 *   Get 9 top public images
 *   info.action: getTopImages
 */

handlers.getTopImages = function (info, req, res) {
  database.getTopRatedLoggedOut(9, 1, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  })
}

/**
 *   Get 9 featured public images
 *   info.action: getFeaturedImages
 */

handlers.getFeaturedImages = function (info, req, res) {
  database.getFeaturedImagesLoggedOut(9, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  })
}

/**
 *   Get 9 recent public images
 *   info.action: getPopularImages
 */

handlers.getRecentImages = function (info, req, res) {
  database.getRecentImagesLoggedOut(9, 1, (images, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!images) res.json([]);
    else res.json(images);
  })
}

// +----------------+--------------------------------------------------
// | Comments       |
// +----------------+

/**
 *   Post a comment on an image
 *   info.action: postComment
 */

handlers.postComment = function (info, req, res) {
  database.saveComment(req, res);
}

/**
 *  Get all comments on an image
 *  info.action = getComments
 */

 handlers.getImageComments = function (info, req, res) {
  database.getComments(req.query.id, (comments, error) => {
    if (error) {
        console.log(error);
        res.json([]);
    } else if (!comments) res.json([]);
    else res.json(comments);
})
 }

// +----------------+--------------------------------------------------
// | Challenges     |
// +----------------+

/*
*   Load challenges to the page
*   info.action: getChallenges
*/

handlers.getChallenges = function (info, req, res) {
  // grab URL parameters 	
  let search = req.query.level + ', ' +
    req.query.color + ', ' + req.query.animation;

  database.getChallenges(search, (challenges, error) => {
    if (error) {
      console.log(error);
      res.json([]);
    } else if (!challenges) res.json([]);
    else res.json(challenges);
  })
}

// +------------------+--------------------------------------------------
// | Authentication   |
// +------------------+


/*
*   Register user to the database
*   info.action: signup
*/

handlers.signUp = function (info, req, res) {
  database.createUser(req, (message) => res.json(message))
}

/*
*   Log user in
*   info.action: signIn
*/

handlers.signIn = function (info, req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      throw err;
    }
    if (!user) {
      var message = "No User Exists";
      res.json(message);
    }
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        var message = "Success";
        res.json(message);
      });
    }
  })(req, res, next);
}


/*
*   Log user out
*   info.action: signOut
*/
handlers.signOut = function (info, req, res) {
  req.logout();
  res.json("Success");
}

/*
*   Get user from Passport
*   info.action: getUser
*/

handlers.getUser = function (info, req, res) {
  if (!req.user) res.json(null);
  else {
      user = req.user;
      res.json(user);
  }
}

