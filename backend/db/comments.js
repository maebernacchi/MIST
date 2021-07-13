const pool = require("./dbconfig"); // Used for database queries
const bcrypt = require("bcrypt"); // Used for password hashing

// +----------------+-------------------------------------------------
// |    Comments    |
// +----------------+

/**
 * saves the comment in the comments collection,
 * the user's comment array, and to image's comment array
 */
 module.exports.saveComment = function (req, res) {
    // build the comment
    //let userID = req.user._id;
    let userID = req.body.userId;
    //let imageID = sanitize(req.params.imageid)
    let imageID = req.body.imageId;
    let comment = Comment({
      userId: userID,
      //body: sanitize(req.body.newComment),
      body: req.body.body,
      active: req.body.active,
      imageId: imageID,
      flags: req.body.flags,
    });
  
    //save comment
    comment
      .save()
      .then((comment) => {
        //push comment to user's comment array
        User.updateOne(
          { _id: mongoose.Types.ObjectId(userID) },
          { $push: { comments: comment._id } }
        )
          .exec()
          .then((writeOpResult) => {
            if (writeOpResult.nModified === 0) {
              console.log("Failed to insert comment into user's array");
            }
          })
          .catch((err) => {
            console.error(err);
            res.end(JSON.stringify(error));
          });
        //push comment to image's comment array
        Image.updateOne({ _id: imageID }, { $push: { comments: comment._id } })
          .exec()
          .then((writeOpResult) => {
            if (writeOpResult.nModified === 0) {
              console.log("Failed to insert comment into image's array");
            } else console.log("Inserted Comment");
          })
          .catch((err) => {
            console.error(err);
            res.end(JSON.stringify(error));
          });
        res.redirect("back");
      })
      .catch((err) => {
        console.error(err);
        res.end(JSON.stringify(error));
      });
  };
  
  //NOTE: This does not check if the comments are hidden from the user
  // the commented out commentInfo does
  /**
   * grab comment information
   * only returns active comments
   * @param imageid
   * @param callback
   */
  module.exports.getCommentsLoggedOut = (imageid, callback) => {
    imageid = sanitize(imageid);
  
    // search the comments collection for documents that with imageid that match image._id
    Comment.find({
      imageId: mongoose.Types.ObjectId(imageid),
      active: true,
    })
      .populate("userId")
      .exec((err, comments) => {
        if (err) {
          console.log(err);
          callback(null, err);
        } else {
          callback(comments, null);
        }
      });
  };
  
  /**
   * grab comment information
   * only returns active not-hidden comments
   * @param userid 
   * @param imageid 
   * @param callback 
   */
  module.exports.getCommentsLoggedIn = (userid, imageid, callback) => {
    imageid = sanitize(imageid);
    userid = sanitize(userid);
  
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
  };