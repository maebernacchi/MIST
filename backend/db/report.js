// +----------+----------------------------------------------------------
// | Reporting/Hiding/Blocking |
// +---------------------------+

/**
 * returns the contentIds for a user's hidden content and their blocked users
 * @param userId: the object id of the user
 * @param type: the type of content (comment, album, or image) 
 * @param callback : returns the ids or the error
 */
 module.exports.getHiddenAndBlockedIDs = (userId, type, callback) => {
    User.findById(userId).exec((err, user) => {
      if (!user)
        callback(false, false, "User does not exist.");
      else {
        if (type === "comment")
          callback(user.hidden.commentIds, user.blockedUsers, null);
        else if (type === "album")
          callback(user.hidden.albumIds, user.blockedUsers, null);
        else if (type === "image")
          callback(user.hidden.imageIds, user.blockedUsers, null);
        else
          callback(false, false, "Incorrect type");
      }
    });
  }
  
  /**
   * hide content from a user
   * @param userid: the objectId of the user wanting to hide something
   * @param type: the type of content being hidden: "comment", "image", or "album" 
   * @param contentId: the objectId of the content being hidden 
   * @return true if successful, false otherwise 
   */
  module.exports.hideContent = async (userid, type, contentId) => {
    userid = sanitize(userid);
    type = sanitize(type);
    contentId = sanitize(contentId);
    try {
      let update;
      switch (type) {
        case "comment":
          update = { $push: { "hidden.commentIds": contentId } }
          break;
        case "album":
          update = { $push: { "hidden.albumIds": contentId } }
          break;
        case "image":
          update = { $push: { "hidden.imageIds": contentId } }
          break;
        default:
          throw "invalid type";
      }
      const { nModified } = await User.updateOne({ _id: userid }, update).exec();
      return (Boolean)(nModified);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * unhide content from a user
   * @param userid: the objectId of the user wanting to unhide something
   * @param type: the type of content being hidden: "comment", "image", or "album" 
   * @param contentid: the objectId of the content being unhidden 
   * @returns true if successful, false otherwise 
   */
  module.exports.unhideContent = async (userid, type, contentid) => {
    try {
      let update;
      switch (type) {
        case "comment":
          update = { $pull: { "hidden.commentIds": contentid } }
          break;
        case "album":
          update = { $pull: { "hidden.albumIds": contentid } }
          break;
        case "image":
          update = { $pull: { "hidden.imageIds": contentid } }
          break;
        default:
          throw "invalid type";
      }
      const { nModified } = await User.updateOne({ _id: userid }, update).exec();
      return (Boolean)(nModified);
    } catch (error) {
      throw error;
    }
  }
  
module.exports.sendReport = async (req, callback) => {
  pool
		.query(
			"insert into reports (user_id, reason, message) \
        values ($1, $2, $3)",
			[req.body.user_id, req.body.reason, req.body.message]
		)
		.then((res) => {
			callback(`Report has been sent`);
		})
		.catch((err) => {
			handleDBError(err, callback);
			return;
		});
}

//Show all the report flags of an user
module.exports.getReports = async (req, callback) => {
  pool
  .query(
    "select * from reports where user_id=$1",
    [req.body.user_id]
  )
  .then((res) => {
    return res.rows;
  })
  .catch((err) => {
    handleDBError(err, callback);
    return;
  });
}

// Determines if an userid exists in  blocked_users
// Returns a boolean value
const checkUseridExists = async (column, value) => {
	const result = await pool.query(
		`select exists (select 1 from blocked_users where ${column} = $1)`,
		[value]
	);
	return result.rows[0].exists;
};

 /**
   * returns whether a user has blocked the user in question
   * @param user_id: the user's id 
   * @param blocked_user_id: the user in question of being blocked's id 
   * @param callback: returns true if the user is blocked, false otherwise 
   */
  module.exports.isBlocked = (user_id, blocked_user_id, callback) => {
      if (!(await checkUseridExists(user_column, user_id))) {
        callback("User ID does not exist!");
      }
      return pool.query(
        "select exists (select * from posts where (user_id=$1 and blocked_user_id=$2))",
        [user_id, blocked_user_id]
      );
    };
  
  /**
   * blocks a user
   * @param userid: the ID of the user who wants to block a user 
   * @param blockedid: the ID of the user to be blocked 
   * @param callback: message to be displayed (failed or success)
   * returns true if successfull, false otherwise
   */
  module.exports.blockUser = async (userid, blockedid, callback) => {
    if (!(await checkUseridExists(user_column, user_id))) {
      callback("User ID does not exist!");
      return;
    }
    pool
      .query(
        "insert into blocked_users (user_id, block_user_id) \
        values ($1, $2)",
        [userid, blockedid]
      )
      .then((res) => {
        callback(`Successfully blocked user`);
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      })
  }
  
  /**
   * unblocks a user
   * @param userid: the objectId of the user who wants to block a user 
   * @param blockedid: the objectId of the user to be blocked 
     */
   module.exports.blockUser = async (userid, blockedid, callback) => {
    pool
      .query("delete from collections where (user_id=$1 and blocked_user_id=$2)"
        [userid, blockedid]
        )
      .then((res) => {
          callback(`Successfully unblock user`);
      })
      .catch((err) => {
        handleDBError(err, callback);
        return;
      });
  }
  
  