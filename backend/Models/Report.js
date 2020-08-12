const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    type: String, // type: Comment, Album, User, Image
    reportedId: mongoose.Schema.Types.ObjectId,
    body: String, // description of the offense, choosen from a list or given by user
    description: String, //optional description of why this was offensive
    count: Number, // count of how many times it has been flagged
    lastFlaggedAt: {
        // the most recent flag date
        type: Date,
        default: Date.now,
    },
    flaggedBy: [
        {
            //array of users(ids) who flagged it
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ] /*
    This could be useful for the future, if the moderators would like the id of 
    the user explitily. For now, the moderator, will have to search the appropirate collection
    for the given id and then check the user information
    flaggedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    } */,
});

module.exports = mongoose.model('Report', reportSchema);