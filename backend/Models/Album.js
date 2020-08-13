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
 * Album.js
 *   Exports the Mongoose model for Album documents which represents
 *   albums of the MIST Images on the MIST Platform.
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