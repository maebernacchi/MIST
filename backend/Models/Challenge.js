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
 * Challenge.js
 *   Exports the Mongoose model for Challenge documents which represents
 *   MIST Challenges.
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