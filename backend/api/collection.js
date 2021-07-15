var collectionHandlers = {};

/**
 * We expect info to have both an
 * imageId : String
 * albumId : String
 */
collectionHandlers.addToAlbum = async function (info, req, res) {
	

	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in to save an image to an album",
		});
	} else {
		try {
			const { albumId, imageId } = info;
			const success = await database.addToAlbum(albumId, imageId);
			if (success) {
				res.json({
					success: true,
					message: "Successfully added image to album",
				});
			} else {
				res.json({
					success: false,
					message:
						"Failed to add due to unknown reason, most likely because image already exists in album",
				});
			}
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

handlers.addImageToAlbum = async function (info, req, res) {
	try {
		const writeOpResult = await database.addToAlbum(
			req.body.album._id,
			req.body.imgID
		);
		res.json({
			success: writeOpResult,
			message: writeOpResult
				? "Successfully added image!"
				: "Failed to add image for unknown reason.",
		});
	} catch (error) {
		res.json({
			message: error,
		});
	}
};

// +--------+------------------------------------------------------
// | Albums |
// +--------+

/**
 * Creates an album for a user. We expect info to be of the form:
 * {
 *  name: String
 * }
 */
handlers.createAlbum = async function (info, req, res) {
	if (!req.isAuthenticated())
		res.json({ success: false, message: "You need to be logged in" });
	else {
		try {
			const userId = req.user._id;
			const { name, caption } = info;
			const success = await database.createAlbum(userId, name, caption);
			if (success) {
				res.json({
					success: true,
					message: "Successfully saved the album " + name,
				});
			} else {
				throw "Failed to save due to unknown reason";
			}
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

/**
 * deletes an album. We expect info to be of the form:
 * {
 *  albumId : String
 * }
 *
 * DANGEROUS : DOES NOT CHECK FOR AUTHORIZATION
 */
handlers.deleteAlbum = async function (info, req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			message: "Failed because you have not been authenticated",
			success: false,
		});
	} else {
		try {
			const { albumId } = info;
			const success = await database.deleteAlbum(req.body.albumID);
			const response = success
				? {
						message: "Succesfully deleted album ",
						success: true,
				  }
				: {
						message: "Failed to delete album for unknow reason",
						success: false,
				  };
			res.json(response);
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

/**
 * We expect info to have
 * {
 *  albumId : String,
 *  newName : String,
 * }
 */
handlers.renameAlbum = async function (info, req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in to rename an album",
		});
	} else {
		try {
			const { albumId, newName } = info;
			const success = await database.renameAlbum(albumId, newName);
			if (success) {
				res.json({
					success: true,
					message: "Successfully renamed album",
				});
			} else {
				res.json({
					success: false,
					message: "Failed to rename album due to unknown reason",
				});
			}
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};
// changes the albums caption
handlers.changeAlbumCaption = async function (info, req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in to modify an album's caption",
		});
	} else {
		try {
			const { albumId, newCaption } = info;
			const success = await database.changeAlbumCaption(albumId, newCaption);
			if (success) {
				res.json({
					success: true,
					message: "Successfully modified album's caption",
				});
			} else {
				res.json({
					success: false,
					message: "Failed to modify album due to unknown reason",
				});
			}
		} catch (error) {
			res.json({
				success: false,
				message: error,
			});
		}
	}
};

handlers.removeImageFromAlbum = async function (info, req, res) {
	if (!req.isAuthenticated()) {
		res.json({
			success: false,
			message: "You need to be logged in to remove an image from an album",
		});
	} else {
		try {
			const { albumId, imageId } = info;
			const writeOpResult = await database.removeImageFromAlbum(
				imageId,
				albumId
			);
			if (writeOpResult.nMatched === 0) {
				// strange no documents were match
				res.json({
					success: false,
					message: "Could not find your chosen album.",
				});
			} else if (writeOpResult.nModified === 0) {
				// strange no documents were modified
				res.json({
					success: false,
					message: "Image not found in album.",
				});
			} else {
				// yay some document was matched
				res.json({
					success: true,
					message: "Successfully removed image",
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
};
