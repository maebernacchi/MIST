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
  
  
  /**
   * returns whether a user has blocked the user in question
   * @param userid: the user's id 
   * @param blockedid: the user in question of being blocked's id 
   * @param callback: returns true if the user is blocked, false otherwise 
   */
  module.exports.isBlocked = (userid, blockedid, callback) => {
    User.findOne({ _id: userid, blockedUsers: { $in: [blockedid] } },
      (err, user) => {
        if (user)
          callback(true)
        else
          callback(false)
      })
  }
  
  /**
   * blocks a user
   * @param userid: the objectId of the user who wants to block a user 
   * @param contentid: the objectId of the user to be blocked 
   * @param callback: message to be displayed (failed or success)
   * returns true if successfull, false otherwise
   */
  module.exports.blockUser = async (userid, blockedid, callback) => {
    return await User.updateOne({ _id: userid }, { $push: { blockedUsers: blockedid } }).exec()
      .then(writeOpResult => (Boolean)(writeOpResult.nModified))
      .then(callback("Successfully blocked user"))
      .catch(error => { callback("Uh-oh something went wrong, we could not block this user at this time.") })
  }
  
  /**
   * unblocks a user
   * @param userid: the objectId of the user who wants to block a user 
   * @param contentid: the objectId of the user to be blocked 
   * @returns true if successful, false otherwise
   */
  module.exports.unblockUser = async (userid, contentid) => {
    return await User.updateOne({ _id: userid }, { $pull: { blockedUsers: contentid } }).exec()
      .then(writeOpResult => (Boolean)(writeOpResult.nModified))
      .catch(error => { throw error })
  }
  