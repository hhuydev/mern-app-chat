const mongoose = require('mongoose');

const FriendRequestStatusSchema = new mongoose.Schema(
    {
        senderId: {
            type: Object,
            required: true,
        },
        receiverId: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model(
    'FriendRequestStatus',
    FriendRequestStatusSchema,
);
