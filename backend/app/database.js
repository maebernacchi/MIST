const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const sanitize = require('mongo-sanitize');

// why was this changed to acme??
mongoose.connect("mongodb://localhost:27017/usersDB", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});// make connection to database or create it if it does not yet exist

mongoose.set('useFindAndModify', false);

// +---------+----------------------------------------------------------
// | Schemas |
// +---------+

const imagesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment", }], // of (of comment _ids)
    title: { type: String, required: true, },
    code: { type: String, required: true, },
    ratings: { type: Number, default: 0, },
    createdAt: { type: String, default: Date.now, },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }], // of (of flag_ids)
    public: Boolean, //true = public, false = private
    caption: String,
    featured: {
        type: Boolean,
        default: false,
    },
});

const commentsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
    },
    body: String,
    createdAt: {
        type: String,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }], // of (of flag_ids)
});

const reportSchema = new mongoose.Schema({
    type: String, // type: Comment, Album, User, Image
    reportedId: mongoose.Schema.Types.ObjectId,
    body: String, // description of the offense, choosen from a list or given by user
    description: String, //optional description of why this was offensive
    count: Number, // count of how many times it has been flagged
    lastFlaggedAt: { // the most recent flag date
        type: Date,
        default: Date.now,
    },
    flaggedBy: [{ //array of users(ids) who flagged it
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }], /*
  This could be useful for the future, if the moderators would like the id of 
  the user explitily. For now, the moderator, will have to search the appropirate collection
  for the given id and then check the user information
  flaggedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  } */
});

const albumsSchema = new mongoose.Schema({
    name: String,
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
    images: [{
        type: mongoose.Schema.ObjectId,
        ref: "Image",
    }],                      // (of Ids)
    createdAt: {
        type: String,
        default: Date.now,
    },
    updatedAt: {
        type: String,
        default: Date.now,
    },
    public: Boolean, // true = public, false = private
    active: Boolean,
    caption: String,
    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }], // of (of flag_ids)
});

const workspacesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: Date.now,
    },
    updatedAt: {
        type: String,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    data: Object,
});

const usersSchema = new mongoose.Schema({
    forename: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },              //hashed
    createdAt: {
        type: String,
        default: Date.now,
    },
    updatedAt: {
        type: String,
        default: Date.now,
    },
    verified: Boolean,
    admin: Boolean,
    moderator: Boolean,
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],                   // of image ids
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],                   // of album ids
    workspaces: [workspacesSchema],               // of workspace objects
    profilepic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        default: null,
    },
    active: {
        type: Boolean,
        default: true,
    },
    hidden: {
        commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        albumIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }],
        imageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }]
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }], // of (of flag_ids)
    liked: [{ type: mongoose.Schema.Types.ObjectId }],   // of image _ids
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],                 //(of comment _ids)
    about: String,
});

const challengeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)

    code: {
        type: String,
        require: true,
    },
    createdAt: {
        type: String,
        default: Date.now,
    },
    updatedAt: {
        type: String,
        default: Date.now,
    },
    active: {
        type: Boolean,
        default: true,
    },
    flags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    }], // of (of flag_ids)
    code: {
        type: String,
        require: true,
    }, // (Beginning,Intermediate,Advanced)(Greyscale,RGB)(Static,Animated)
    position: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
});

// Configuring Schemas
usersSchema.plugin(passportLocal);

// Models
const User = mongoose.model("User", usersSchema);
const Image = mongoose.model("Image", imagesSchema);
const Comment = mongoose.model("Comment", commentsSchema);
const Album = mongoose.model("Album", albumsSchema);
const Challenge = mongoose.model("Challenge", challengeSchema);
const Workspace = mongoose.model("Workspace", workspacesSchema);
const Report = mongoose.model("Report", reportSchema);


// Export models
module.exports.User = User;
module.exports.Image = Image;
module.exports.Comment = Comment;
module.exports.Album = Album;
module.exports.Challenge = Challenge;
module.exports.Workspace = Workspace;
module.exports.Report = Report;


// Export Utilities
module.exports.Types = mongoose.Types;
module.exports.sanitize = sanitize; //sanitizes string

// +------------+-------------------------------------------------
// | Utitilites |
// +------------+

const Models = {
    "Image": Image,
    "Comment": Comment,
    "Album": Album,
    "Challenge": Challenge,
    "Workspace": Workspace,
    "Report": Report,
}

// everything after this is queries

// +------------+-------------------------------------------------
// |   Images   |
// +------------+


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
        { $match: { public: true, active: true } },
        { $sample: { size: count } }])
        .populate('userId')
        .exec((err, images) => {
            if (err)
                callback(null, err)
            else
                callback(images, null)
        });
}

/**
 * grab recent images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages. 
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error 
 */
module.exports.getRecentImagesLoggedOut = (count, page, callback) => {
    Image.find({ public: true, active: true })
        .sort({ createdAt: -1 })
        .limit(count)
        .populate('userId')
        .exec((err, images) => {
            if (err)
                callback(null, null, err);
            else if (images.length <= count) {
                callback(images, false, err)
            }
            else {
                callback(images, true, err)
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
    .populate('userId')
    .exec((err, images) => {
        if (err)
            callback(null, err)
        else {
            callback(images, null)
        }
    })

}

/**
 * grab top rated images for logged out user
 * @param count: the max amount of images returned for the page
 * @param page: the current page
 *  Note: page was an orginial mist team parameter, which was used to support multiple gallery pages. 
 *        This has not been implemented on the front-end yet, but it is left here for future use
 * @param callback: returns either the images, page(boolean), and the error 
 */
module.exports.getTopRatedLoggedOut = (count, page, callback) => {
    Image.find({ public: true, active: true })
        .sort({ ratings: -1 })
        .limit(count)
        .populate('userId')
        .exec((err, images) => {
            if (err)
                callback(null, null, err); // might need to be null
            else if (images.length <= count)
                callback(images, false, err)
            else
                callback(images, true, err)
        });
};

// +----------------+-------------------------------------------------
// |   Challenges   |
// +----------------+

module.exports.getChallenges = (category, callback) => {
    Challenge.find({ category: category }, (err, challenges) => {
        if (err)
            callback(null, err);
        else
            callback(challenges, null);
    })
}

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
        flags: req.body.flags
    });

    //save comment
    comment.save()
        .then(comment => {
            //push comment to user's comment array
            User.updateOne({ _id: userID }, { $push: { comments: comment._id } })
                .exec()
                .then((writeOpResult) => {
                    if (writeOpResult.nModified === 0) {
                        console.log("Failed to insert comment into user's array");
                    }
                })
                .catch(err => {
                    console.error(err)
                    res.end(JSON.stringify(error));
                })
            //push comment to image's comment array
            Image.updateOne({ _id: imageID }, { $push: { comments: comment._id } })
                .exec()
                .then((writeOpResult) => {
                    if (writeOpResult.nModified === 0) {
                        console.log("Failed to insert comment into image's array");
                    } else console.log("Inserted Comment");
                })
                .catch(err => {
                    console.error(err)
                    res.end(JSON.stringify(error));
                })
            res.redirect('back');
        })
        .catch(err => {
            console.error(err)
            res.end(JSON.stringify(error));
        })
}


//NOTE: This does not check if the comments are hidden from the user
// the commented out commentInfo does
/**
 * grab comment information
 * only returns active comments
 * @param imageid 
 * @param callback 
 */
module.exports.getComments = (imageid, callback) => {
    imageid = sanitize(imageid);

    // search the comments collection for documents that with imageid that match image._id
    Comment.
        find({
            imageId: mongoose.Types.ObjectId(imageid),
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
};


/**
 * grab comment information
 * returns active, un-hidden comments
 * @param userid 
 * @param imageid 
 * @param callback 
 */
/*
module.exports.commentInfo = (userid, imageid, callback) => {
    imageid = sanitize(imageid);
    userid = sanitize(userid);
  
    module.exports.getHiddenAndBlockedIDs(userid, "comment", (contentIds, blockedUsers, err) => {
      if (err)
        callback(null, err)
      else {
        // how to return five at time? because rn we are returning all comments
        // username!!!!!
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
  */


// +------------+-------------------------------------------------
// |    Misc    |
// +------------+

module.exports.getUsername = (userId, callback) => {
    User.findById(userId).exec((err, user) => {
        if (err)
            callback(null, err)
        else
            callback(user.username, null);
    })
};

