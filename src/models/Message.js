const mongoose = require('mongoose');

const MessageSchmea = new mongoose.Schema(
    {
        conversationId: {
            type: String,
            required: true,
        },
        sender: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        type: {
            type: String,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Message', MessageSchmea);
