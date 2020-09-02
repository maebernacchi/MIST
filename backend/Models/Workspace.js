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
 * Workspace.js
 *   Exports the Mongoose model for Workspace objects which represents
 *   a workspace stored from the MIST GUI Workspace.
 * Author: Davin Lin
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/*
 * A Workspace needs to track its name, date of creation, date last updated,
 * whether it is still wanted, and information that is neccessary 
 * to reload it into the workspace.
 *
 * We store each of these respectively as the fields: name, createdAt,
 * updatedAt, active, and data.
 * 
 * The types of each of these fields are specified in the schema and 
 * enforced via Mongoose validation. 
 * 
 * The data field is the most loosely typed, being of type Object. This
 * is so that the Front-End GUI Designers have free reign over what belongs
 * in a Workspace object. 
 * 
 */

const mongoose = require('mongoose');

const workspacesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    data: Object,
});

module.exports = mongoose.model('Workspace', workspacesSchema);