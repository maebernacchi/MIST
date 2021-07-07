// +----------------+--------------------------------------------------
// | Image Handlers |
// +----------------+

/**
 * Check if an image exists (should be imagetitleexists)
 *   info.action: imageexists
 *   info.title: The title of the image
 */
handlers.imageExists = function (info, req, res) {
	const next = () => {
		database.imageExists(req.user.username, info.title, (err, response) => {
			if (err) {
				const errorMessage = `Unable to save image due to server error: ${err}`;
				dispatchResponse(res, "error", 500, undefined, errorMessage);
			} else {
				dispatchResponse(res, "success", undefined, {
					exists: Boolean(response),
				});
			}
		});
	};
	checkAuthentication(req, res, next);
};

/**
 * Save an image to the database
 *   info.action: saveimage
 *   info.title: The title of the image
 */
handlers.saveImage = function (info, req, res) {
	const next = () => {
		const { title, code } = info;
		database
			.saveImage(req.user._id, title, code)
			.then(() => dispatchResponse(res, "success", undefined, null))
			.catch((error) =>
				dispatchResponse(res, "error", 500, undefined, `Error: ${error}`)
			);
	};
	// The user must be authenticated in order to save an image
	checkAuthentication(req, res, next);
};


// +----------------+--------------------------------------------------
// | Comments       |
// +----------------+

/**
 *   Post a comment on an image
 *   info.action: postComment
 */

handlers.postComment = function (info, req, res) {
	database.saveComment(req, res);
};

/**
 *  Get all comments on an image
 *  info.action = getComments
 */

handlers.getImageComments = function (info, req, res) {
	let loginStatus = false;
	if (req.isAuthenticated()) loginStatus = true;

	if (loginStatus) {
		database.getCommentsLoggedIn(
			req.user._id,
			req.query.id,
			(comments, error) => {
				if (error) {
					console.log(error);
					res.json([]);
				} else if (!comments) res.json([]);
				else res.json(comments);
			}
		);
	} else {
		database.getCommentsLoggedOut(req.query.id, (comments, error) => {
			if (error) {
				console.log(error);
				res.json([]);
			} else if (!comments) res.json([]);
			else res.json(comments);
		});
	}
};


