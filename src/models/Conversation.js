const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 30,
            unique: true,
            required: false,
        },
        members: {
            type: [],
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', ConversationSchema);
