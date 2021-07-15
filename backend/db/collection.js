const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing 

// +--------+----------------------------------------------------------
// | Albums |
// +--------+

// create Collection
module.exports.createCollection = async (req, res) => {
  pool.query("insert into collections (user_id, title, caption, collection_id) \
values ($1, $2, $3, $4)",
    [req.body.user_id, req.body.title, req.body.caption, collection_id]
)
    .then((res) => {
      callback(`Collection has been created`);
  })
  .catch((err) => {
      handleDBError(err, callback);
      return;
  });

 }
  
  /**
  * deletes a collection
  * DANGEROUS DOES NOT CHECK FOR AUTHORIZATION
  */
  module.exports.deleteAlbum = async (req, callback) => {
    pool.query("delete from collections where (user_id=req.body.user_id and title = req.bod.title)")
      .then((res) => {
          callback(`Collection has been deleted`);
      })
      catch((err) => {
        handleDBError(err, callback);
        return;
      });
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