const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing 
 

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