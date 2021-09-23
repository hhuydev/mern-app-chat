const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
    },
    friend: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Friends", FriendsSchema);
