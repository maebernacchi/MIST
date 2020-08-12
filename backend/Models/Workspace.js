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