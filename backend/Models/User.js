const mongoose = require('mongoose');
const passportLocal = require("passport-local-mongoose");

const workspaceSchema = require('../Models/Workspace').schema;

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
    }, //hashed
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
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // of image ids
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Album" }], // of album ids
    workspaces: [workspaceSchema], // of workspace objects
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
        imageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    flags: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
    ], // of (of flag_ids)
    liked: [{ type: mongoose.Schema.Types.ObjectId }], // of image _ids
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], //(of comment _ids)
    about: {
        String,
        default: "",
    },
    expertWorkspaces: [Object],
});


// Configuring Schemas
usersSchema.plugin(passportLocal);


module.exports = mongoose.model('User', usersSchema);