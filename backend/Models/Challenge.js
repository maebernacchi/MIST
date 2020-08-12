const mongoose = require('mongoose');

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
    flags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
    ], // of (of flag_ids)
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

module.exports = mongoose.model('Challenge', challengeSchema);