const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      min: 3,
      max: 30,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      min: 3,
      max: 30,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid!");
      },
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
      required: true,
    },
    friends: {
      type: Array,
      default: [],
    },
    avatar: {
      type: Buffer,
    },
    city: {
      type: String,
      min: 2,
      max: 30,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
