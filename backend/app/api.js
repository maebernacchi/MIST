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
    res.json("logged out");
  } else {

    database.imageExists(req.user.username, info.title, (err, response) => {
      if (err)
        fail(res, "Unable to save image")
      if (response)
        res.json("image exists")
      else
        res.json("image does not exist")
    })

  }
};


/**
 * Save an image to the database
 *   info.action: saveimage
 *   info.title: The title of the image
 */
handlers.saveimage = function (info, req, res) {

  database.getUserIdByUsername(req.user.username, (err, userId) => {
    if (err)
      fail(res, "no user found");
    else {
      database.saveImage(userId, req.body.title, req.body.code, res)
    }
  });

}

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

// +--------------------+----------------------------------------------
// | Workspace Handlers |
// +--------------------+

/**
 * Check if an image exists
 *   info.action: wsexists
 *   info.title: The title of the image
 */
handlers.wsexists = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    res.json("logged out");
  }
  else {
    try {
      const exists = await database.wsexists(req.user._id, info.name);
      res.json({ exists: exists, success: true })
    } catch (error) {
      res.json('Database query failed for unknown reason')
    }
  } // else
};

/**
 * Get workspaces
 *  info.action: getws
 *  info. 
 */
handlers.getws = async function (info, req, res) {
  try {
    // check if user is authenticated
    if (!req.isAuthenticated())
      throw ('You have to be logged in!')

    // retrieve the workspaces corresponding to a user
    const workspaces = await database.getws(req.user._id);
    // send the response containing the workspaces
    res.json({
      success: true,
      workspaces: workspaces,
    })

  } catch (error) {
    res.json({
      success: false,
      message: error,
    })
  }
}

/**
* Save a workspace.
*   action: savews
*   name: the name of the workspace
*   data: The information about the workspace
*   replace: true or false [optional]
* Precondition:
* The user does not already own a workspace by the same name.
*/
handlers.savews = async function (info, req, res) {
  if (!req.isAuthenticated()) {
    fail(res, "Could not save workspace because you're not logged in");
  }
  else if (!info.workspace.name) {
    fail(res, "Could not save workspace because you didn't title it");
  }
  else {
    try {
      const workspace = info.workspace
      const bulkWriteOpResult = await database.savews(req.user._id, workspace);
      if (bulkWriteOpResult.nMatched === 0) {
        console.log('here')
        throw ('Error Unknown')
      }
      else
        res.json({ success: true })
    } catch (error) {
      res.json({ success: false, message: error })
    }

  }
} // handlers.savews


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
    // we have to search the database for the full user
    // because passport only stores the username of the person logged in
    database.User.findOne({ username: req.user.username }, (err, user) => {
      if (err)
        fail(res, "no user found")
      else
        res.json(user)
    })
  }
}

// +-----------+------------------------------------------------------
// | Expert UI |
// +-----------+

handlers.expertwsexists = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: 'You need to be logged in!' })
  else {
    const userId = req.user._id;
    const name = info.name;
    database.userHasWorkspace(userId, name, res);
  }
}

handlers.saveexpertws = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: 'You need to be logged in!' })
  else {
    const userId = req.user._id;
    const workspace = info.workspace;
    database.saveExpertWorkspace(userId, workspace, res);
  }
}

handlers.deleteexpertws = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: 'You need to be logged in!' })
  else {
    const userId = req.user._id;
    const workspace_name = info.name;
    database.deleteexpertws(userId, workspace_name, res);
  }
}

handlers.getUserExpertWS = function (info, req, res) {
  if (!req.isAuthenticated())
    res.json({ success: false, message: 'You need to be logged in!' })
  else {
    const userId = req.user._id;
    database.getUserExpertWS(userId, res);
  }
}