const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing 

// +--------+----------------------------------------------------------
// | Albums |
// +--------+

// create Album
module.exports.createAlbum = async (userid, name, caption) => {
    userid = sanitize(userid);
    name = sanitize(name);
    caption = sanitize(caption)
    let album = new Album({
      name: name,
      userId: userid,
      public: false,
      active: true,
      flag: false,
      caption: caption,
    }) // create album document object 
    try {
      //save the album object
      const albumObject = await album.save();
      if (albumObject) {
        return (
          User
            .updateOne({ _id: userid }, { $push: { albums: albumObject._id } })
            .exec()
            .then(writeOpResult => writeOpResult.nModified)
            .catch(error => { throw error })
        );
      } else {
        throw 'Failed to safe for Unknown reason'
      }
    } catch (error) {
      throw error;
    }
  }; // createAlbum
  
  /**
  * deletes an album
  * DANGEROUS DOES NOT CHECK FOR AUTHORIZATION
  * @param userId: the object ID for the user
  * @param albumId: the object ID for the album
  */
  module.exports.deleteAlbum = async (albumId) => {
    // sanitize ID's
    //albumId = sanitize(albumId);
    return await Album.deleteOne({ _id: albumId })
      .catch(error => { throw error })
  }
  
  // remove image from album
  module.exports.removeImageFromAlbum = async (imageId, albumId) => {
    return Album.updateOne({ _id: sanitize(albumId) }, { $pull: { "images": sanitize(imageId) }, updatedAt: Date.now() }).exec();
  }

const collectionExists = async (user_id, title, callback) => {
    if (!(await checkUserExists(user_column, user_id))) {
          callback("User ID does not exist!");
      }
      
    return pool.query("select exists (select * from collections where (user_id=$1 and title=$2))",
                      [user_id, title]);
};

 // rename a collection
 module.exports.renameCollection = async (user_id, current_title, new_title, callback) => {
    if (!(await collectionExists(user_id, current_title, callback))) {
        callback("Collection does not exist!");
        return;
    }

    pool.query("update collections set title=$1 where (user_id=$2 and title=$3)",
                [new_title, user_id, current_title]);
  };
  
  // change an album's caption
  module.exports.changeAlbumCaption = async (user_id, collection_title, new_caption, callback) => {
    if (!(await collectionExists(user_id, collection_title, callback))) {
        callback("Collection does not exist!");
        return;
    }

    pool.query("update collections set caption=$1 where (user_id=$2 and title=$3)",
                [new_caption, user_id, collection_title]);
  };