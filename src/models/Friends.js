const mongoose = require('mongoose');

const FriendsSchema = new mongoose.Schema(
    {
        friends: {
            type: [],
            required: true,
        },
    },
    { timestamps: true },
);
module.exports = mongoose.model('Friends', FriendsSchema);
