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
  
  /**
   * saves the new image in the database
   * @param title title of the image
   * @param caption caption of the image (optional)
   * @param code code for the image
   * @param user_id the username of the user
   * @param visibility visibility of the image (true if public, false if private)
   */
  module.exports.saveImage = async (title, caption, code, user_id, visibility) => {
    if (await imageExists(user_id)) {
      callback("User ID does not exist!");
    }

    pool.query("insert into posts (title, caption, code, user_id, public) \
                            values ($1, $2, $3, $4, $5)", 
                            [title, caption, code, user_id, visibility]);
    
    //build image
    let image = Image({
      userId: sanitize(userId),
      title: sanitize(title),
      code: sanitize(code),
      public: true,
      caption: "",
    });
    //save image
    const imageDocument = await image.save();
    if (!imageDocument) {
      throw Error('Unknown reason.')
    }
    const writeOpResult = await User.updateOne({ _id: userId }, { $push: { images: image._id } }).exec();
    // We need to verify that the image has been linked to the user
    if (writeOpResult.nMatched === 0) {
      // We do not expect to be in this case as there must be at least one match because the user must
      // be authorized in order to make this query. Hence there should be a matching user document.
      throw Error("Linking image to user failed because we could not locate the user's document.");
    }
    if (writeOpResult.nModified === 0) {
      // We do not expect to be in this case as there the query is done by the push operator
      // on an existing user document. As the user document should exist with an array as the value 
      // corresponding to its "images" field, this should succeed. We will default to say that it 
      // is because the user's document is exceed the default maximum capacity of 16MB.
      throw Error("Linking image to user failed because there is not enough space.")
    }
  };
  
  /**
   * Adds an image to an album
   * @param {String} albumId 
   * @param {String} imageId 
   */
  module.exports.addToAlbum = async (albumId, imageId) => {
    // Sanitize inputs.  Yay!
    albumId = sanitize(albumId);
    imageId = sanitize(imageId);
    return await Album.updateOne({ _id: albumId }, { $addToSet: { images: imageId }, updatedAt: Date.now() }).exec()
      .then(writeOpResult => (Boolean)(writeOpResult.nModified))
      .catch(error => { throw error })
  };
  
  // rename an album
  module.exports.renameAlbum = async (albumId, newName) => {
    // Sanitize inputs.  Yay!
    albumId = sanitize(albumId);
    newName = sanitize(newName);
  
    return await Album.updateOne({ _id: albumId }, { name: newName, updatedAt: Date.now() }).exec()
      .then(writeOpResult => writeOpResult.nModified)
      .catch(error => { throw error })
  
  };
  
  // change an album's caption
  module.exports.changeAlbumCaption = async (albumId, newCaption) => {
    // Sanitize inputs.  Yay!
    albumId = sanitize(albumId);
    newCaption = sanitize(newCaption);
  
    return await Album.updateOne({ _id: albumId }, { caption: newCaption, updatedAt: Date.now() }).exec()
      .then(writeOpResult => writeOpResult.nModified)
      .catch(error => { throw error })
  };
  