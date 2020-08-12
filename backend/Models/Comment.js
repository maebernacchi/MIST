const mongoose = require("mongoose");

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
    flags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
    ], // of (of flag_ids)
});

module.exports = mongoose.model('Comment', commentsSchema);