const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing

// +------------+-------------------------------------------------
// |   Images   |
// +------------+

// Determines if a user exists, given their username (user_id)
// Returns a boolean value
const checkUserExists = async (column, value) => {
	const result = await pool.query(
		`select exists (select 1 from users where ${column} = $1)`,
		[value]
	);
	return result.rows[0].exists;
};

/**
 * checks whether the user owns an image with the same title
 * @param user_id the username of the user
 * @param title the title of the image
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */
module.exports.imageExists = async (user_id, title, callback) => {
	if (!(await checkUserExists(user_column, user_id))) {
		callback("User ID does not exist!");
	}

	return pool.query(
		"select exists (select * from posts where (user_id=$1 and title=$2))",
		[user_id, title]
	);
};

module.exports.collectionExists = async (user_id, title, callback) => {
	if (!(await checkUserExists(user_column, user_id))) {
		callback("User ID does not exist!");
	}

	return pool.query(
		"select exists (select * from collections where (user_id=$1 and title=$2))",
		[user_id, title]
	);
};

/**
 * saves the new image in the database
 * @param title title of the image
 * @param caption caption of the image (optional)
 * @param code code for the image
 * @param user_id the username of the user
 * @param visibility visibility of the image (true if public, false if private)
 * @param callback sends the error if there is one, true
 * if the image exists, and false if it does not
 */

//TODO: if image already is saved, override it?
module.exports.saveImage = async (req, callback) => {
	if (await imageExists(req.body.user_id, req.body.title, callback)) {
		callback("Image already exists!");
		return;
	}

	pool
		.query(
			"insert into posts (title, caption, code, user_id, public) \
        values ($1, $2, $3, $4, $5)",
			[req.body.title, req.caption, req.code, req.user_id, req.public]
		)
		.then((res) => {
			callback(`Image ${req.body.title} has been created`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};

/**
 * Adds an image to a collection
 * @param {String} albumId
 * @param {String} imageId
 */
module.exports.addToCollection = async (req, callback) => {
	let post_id = 0;
	let collection_id = 0;

	if (
		!(await collectionExists(
			req.body.user_id,
			req.body.collection_title,
			callback
		))
	) {
		callback("Collection does not exist!");
		return;
	}
	if (
		!(await imageExists(req.body.image_author, req.body.image_title, callback))
	) {
		callback("Image does not exist!");
		return;
	}

	pool
		.query("select post_id from posts where (user_id=$1 and title=$2)", [
			req.body.image_author,
			req.body.image_title,
		])
		.then((res) => {
			post_id = res.rows[0].post_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"select collection_id from collections where (user_id=$1 and title=$2)",
			[req.body.user_id, req.body.collection_title]
		)
		.then((res) => {
			collection_id = res.rows[0].collection_id;
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});

	pool
		.query(
			"insert into collection_images (post_id, collection_id) values ($1, $2)",
			[post_id, collection_id]
		)
		.then((res) => {
			callback("Image inserted into collection successfully!");
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
};
