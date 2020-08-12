const mongoose = require('mongoose');

const albumsSchema = new mongoose.Schema({
    name: String,
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        require: true,
    },
    images: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Image",
        },
    ], // (of Ids)
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
    flags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
    ], // of (of flag_ids)
});

module.exports = mongoose.model('Album', albumsSchema);