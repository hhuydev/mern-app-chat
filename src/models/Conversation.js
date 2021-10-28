const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 30,
            unique: true,
            required: true,
        },
        members: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', ConversationSchema);
