const pool = require("./dbconfig"); // Used for database queries

// +----------------+-------------------------------------------------
// |    Comments    |
// +----------------+


/**
 * saves the comment in the comments collection,
 * the user's comment array, and to image's comment array
 */
 module.exports.saveComment = async (req, callback) => {
  let post_id = 0
  pool.query("select post_id from posts where (user_id=$1 and title=$2)",
        [req.body.post_author, req.body.post_title]
  )
    .then((res) => {
      let post_id = res.rows[0].post_id
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
  });

  pool
    .query(
      "insert into comments (content, user_id, post_id, parent_comment) \
  values ($1, $2, $3, $4)", 
      [req.body.content, req.body.user_id, post_id, req.body.parent_comment]
  )
  .then((res) => {
      callback(`Comment has been created`);
  })
  .catch((err) => {
      handleDBError(err, callback);
      return;
  });

 }

 
  
  //NOTE: This does not check if the comments are hidden from the user
  // the commented out commentInfo does
  /**
   * grab comment information
   * only returns active comments
   * @param imageid
   * @param callback
   */
  module.exports.getComments = async(req, callback) => {
    let post_id = 0
  pool.query("select post_id from posts where (user_id=$1 and title=$2)",
        [req.body.post_author, req.body.post_title]
  )
    .then((res) => {
      let post_id = res.rows[0].post_id
    })
    .catch((err) => {
      handleDBError(err, callback);
      return;
  });

    pool.query("select * from comments where post_id=$1",
    [post_id])
    .then((res) => {
      return res;
    });

  
    }

  
    module.exports.getHiddenAndBlockedIDs(userid, "comment", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, err)
      else {
        // how to return five at time? because rn we are returning all comments
        // look into aggregation
        Comment.
          find({
            //exclude hidden comments and blocked users
            _id: { $nin: contentIds },
            userId: { $nin: blockedUsers },
            imageId: mongoose.Types.ObjectId(imageid),
            //include only active comments
            active: true,
          }).
          populate('userId').
          exec((err, comments) => {
            if (err) {
              console.log(err);
              callback(null, err);
            } else {
              callback(comments, null);
            }
          });
      }
    })
