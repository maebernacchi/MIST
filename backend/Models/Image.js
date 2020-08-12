const mongoose = require("mongoose");

const imagesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // of (of comment _ids)
    title: { type: String, required: true },
    code: { type: String, required: true },
    ratings: { type: Number, default: 0 },
    createdAt: { type: String, default: Date.now },
    updatedAt: {
        type: Date,
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
    public: Boolean, //true = public, false = private
    caption: String,
    featured: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Image", imagesSchema);