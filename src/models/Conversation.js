const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 2,
            maxlength: 30,
            required: false,
        },
        members: {
            type: [],
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
        },
        isGroup: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', ConversationSchema);
