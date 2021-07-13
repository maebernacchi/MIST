// +------------+-------------------------------------------------
// |   Gallery  |
// +------------+

/**
 * grab random images for logged out user
 * @param count: the max amount of images returned
 * @param callback: returns either the images or the error
 */
 module.exports.getRandomImagesLoggedOut = (count, callback) => {
    Image.aggregate([
      // find only public and active images
      { $match: { public: true, active: true } },
      { $sample: { size: count } },
    ]).exec((err, images) => {
      if (err) callback(null, err);
      else {
        // populate the images with the user information so we can access their username
        Image.populate(images, { path: "userId" }, (err, images) => {
          if (err) callback(null, err);
          else callback(images, null);
        });
      }
    });
  };
  
  /**
   * grab random images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned 
   * @param callback: returns either the images or the error 
   */
  module.exports.getRandomImagesLoggedIn = (userId, count, callback) => {
    module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, err)
      else {
        Image.aggregate([
          {
            $match: {
              public: true,
              active: true,
              // exlude the blocked images
              _id: { $nin: contentIds },
              // exclude the blocked users
              userId: { $nin: blockedUsers }
            }
          },
          { $sample: { size: count } }])
          .exec((err, images) => {
            if (err)
              callback(null, err)
            else {
              // populate the images with the user information so we can access their username
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, err);
                else callback(images, null);
              });
            }
          });
      }
    })
  };
  
  
  /**
   * grab featured images for logged out user
   * @param count: the max amount of images returned
   * @param callback: returns either the images or the error
   */
  module.exports.getFeaturedImagesLoggedOut = (count, callback) => {
    Image.find({ featured: true, active: true })
      .limit(count)
      .populate("userId")
      .exec((err, images) => {
        if (err) callback(null, err);
        else {
          callback(images, null);
        }
      });
  };
  
  /**
   * grab featured images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned 
   * @param callback: returns either the images or the error 
   */
  module.exports.getFeaturedImagesLoggedIn = (userId, count, callback) => {
    module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, err)
      else {
        Image.find({
          featured: true,
          active: true,
          // exlude the blocked images
          _id: { $nin: contentIds },
          // exclude the blocked users
          userId: { $nin: blockedUsers }
        })
          .limit(count)
          .exec((err, images) => {
            if (err)
              callback(null, err)
            else {
              // populate the images with the user information so we can access their username
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, err);
                else callback(images, null);
              });
            }
          })
      }
    })
  };
  
  /**
   * grab recent images for logged out user
   * @param count: the max amount of images returned for the page
   * @param page: the current page (boolean)
   *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
   *        This has not been implemented on the front-end yet, but it is left here for future use.
   *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
   *        next page.
   * @param callback: returns either the images, page(boolean), and the error
   */
  module.exports.getRecentImagesLoggedOut = (count, page, callback) => {
    Image.find({ public: true, active: true })
      // most recent -> least recent order
      .sort({ createdAt: -1 })
      .limit(count)
      .populate("userId")
      .exec((err, images) => {
        if (err) callback(null, null, err);
        // if the page number is less than the count, then we do not have a next page
        else if (images.length <= count) {
          callback(images, false, err);
        } else {
          callback(images, true, err);
        }
      });
  };
  
  /**
   * grab recent images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned for the page
   * @param page: the current page (boolean)
   *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
   *        This has not been implemented on the front-end yet, but it is left here for future use.
   *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
   *        next page.
   * @param callback: returns either the images, page(boolean), and the error 
   */
  module.exports.getRecentImagesLoggedIn = (userId, count, page, callback) => {
    module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, null, err)
      else {
        Image.find({
          public: true,
          active: true,
          // exlude the blocked images
          _id: { $nin: contentIds },
          // exclude the blocked users
          userId: { $nin: blockedUsers }
        })
          .sort({ createdAt: -1 })
          .limit(count)
          .exec((err, images) => {
            if (err)
              callback(null, null, err);
            // if the page number is less than the count, then we do not have a next page
            else if (images.length <= count) {
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, null, err);
                else callback(images, false, null);
              });
            }
            else {
              // populate the images with the user information so we can access their username
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, null, err);
                else callback(images, true, null);
              });
            }
          })
      }
    })
  };
  
  /**
   * grab top rated images for logged out user
   * @param count: the max amount of images returned for the page
   * @param page: the current page
   * @param page: the current page (boolean)
   *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
   *        This has not been implemented on the front-end yet, but it is left here for future use.
   *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
   *        next page.
   * @param callback: returns either the images, page(boolean), and the error
   */
  module.exports.getTopRatedLoggedOut = (count, page, callback) => {
    Image.find({ public: true, active: true })
      .sort({ ratings: -1 })
      .limit(count)
      .populate("userId")
      .exec((err, images) => {
        if (err) callback(null, null, err);
        // if the page number is less than the count, then we do not have a next page
        else if (images.length <= count) callback(images, false, err);
        else callback(images, true, err);
      });
  };
  
  /**
   * grab top rated images for logged in user
   * Excludes images the user has hidden or blocked
   * @param count: the max amount of images returned for the page
   * @param page: the current page (boolean)
   *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages.
   *        This has not been implemented on the front-end yet, but it is left here for future use.
   *        This boolean value would tell us if we had a "next page" aviable, i.e if we had images for the
   *        next page.
   * @param callback: returns either the images, page(boolean), and the error 
   */
  module.exports.getTopRatedLoggedIn = (userId, count, page, callback) => {
    module.exports.getHiddenAndBlockedIDs(userId, "image", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, null, err)
      else {
        Image.find({
          public: true,
          active: true,
          // exlude the blocked images
          _id: { $nin: contentIds },
          // exclude the blocked users
          userId: { $nin: blockedUsers }
        })
          .sort({ ratings: -1 })
          .limit(count)
          .exec((err, images) => {
            if (err)
              callback(null, null, err);
            // if the page number is less than the count, then we do not have a next page 
            else if (images.length <= count)
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, null, err);
                else callback(images, false, null);
              });
            else
              // populate the images with the user information so we can access their username
              Image.populate(images, { path: "userId" }, (err, images) => {
                if (err) callback(null, null, err);
                else callback(images, true, null);
              });
          })
      }
    })
  };