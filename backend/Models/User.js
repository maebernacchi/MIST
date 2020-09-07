/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * User.js
 *   Exports the Mongoose model for User documents which represents
 *   users of the MIST Platform.
 * Author: Himanshu Bainwala
 * Author: Arsema Berhane 
 * Author: Christa Cochran
 * Author: Mingyang Fan
 * Author: Davin Lin
 * Author: Nina Kouchi
 * Author: Asya Shneerson
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/*
 * For a User we track numerous fields; they (and their purposes) are:
 *
 * forename, surname: Records the forename and surname specified
 *  of a user at signup. 
 * email : Records the email of a user, to be used for verification.
 *  Future uses can include newletters.
 * username : Records the username that will be used for secure login
 * password : Records the password that will be used for secure login.
 *  Passwords are Hashed so that we do not store decryptable passwords.
 * createdAt : Records the date at which the user signed up to the system.
 * updatedAt : Records the last date at which the user changed their account
 *  settings.
 * verified : Records whether or not a user has verified their account.
 * admin : Records whether a user has admin privileges and responsibilities.
 * moderator : Records whether a user has moderator privileges and responsibilities.
 * images : Stores references to the images that a user has created.
 * albums : Stores references to the albums that a user has created.
 * workspaces : Stores the Workspaces that a user has created.
 * profilepic : Stores the code for the MIST Image chosen as a user's profile 
 *  picture. 
 * active : Records whether or not an account is still active.
 * hidden : Records the information that a user has chosen to keep hidden by 
 *  default.
 * blockedUsers : Records the other MIST users that whose content a User has chosen
 *  to block.
 * flags : <INCOMPLETE>
 * liked : <INCOMPLETE>
 * comments : Stores references to the comments that a user has made.
 * about : Records a users 'about-me' info.
 * expertWorkspaces : Stores a User's Expert Workspaces.
 * 
 * INCOMPLETE:
 * Need to explain : passport-local
 */
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
    token: String,
    tokenExpiry: Date
});


// Configuring Schemas
usersSchema.plugin(passportLocal);


module.exports = mongoose.model('User', usersSchema);