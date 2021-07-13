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
	console.log(result);
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
    
  return pool.query("select exists (select * from posts where (user_id=$1 and title=$2))",
                    [user_id, title]);
};
  

module.exports.collectionExists = async (user_id, title, callback) => {
  if (!(await checkUserExists(user_column, user_id))) {
		callback("User ID does not exist!");
	}
    
  return pool.query("select exists (select * from collections where (user_id=$1 and title=$2))",
                    [user_id, title]);
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
  module.exports.saveImage = async (title, caption, code, user_id, visibility, callback) => {
    if (await imageExists(user_id, title, callback)) {
      callback("Image already exists!");
      return;
    }

    pool.query("insert into posts (title, caption, code, user_id, public) \
                            values ($1, $2, $3, $4, $5)", 
                            [title, caption, code, user_id, visibility]);
  };
  
  /**
   * Adds an image to a collection
   * @param {String} albumId 
   * @param {String} imageId 
   */
  module.exports.addToCollection = async (user_id, collection_title, image_title, image_author) => {
    if (!(await collectionExists(user_id, collection_title, callback))) {
      callback("Collection does not exist!");
      return;
    }
    if (!(await imageExists(image_author, image_title, callback))) {
      callback("Image does not exist!");
      return;
    }

    let collection_contents = pool.query("select * from collections where (user_id=$1 and title=$2)",
                                          [user_id, collection_title]);
    
    const collection_length = collection_contents[0].length;

    collection_contents[0][collection_length] = image_title;
    collection_contents[1][collection_length] = image_author;
    
    pool.query("update collections set contents=$1 where (title=$2 and user_id=$3)",
                [collection_contents, collection_title, user_id]);
  };
  
 
  