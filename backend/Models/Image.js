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
 * Image.js
 *   Exports the Mongoose model for Image documents which represents
 *   MIST Images.
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
 *
 * INCOMPLETE
 * 
 */
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