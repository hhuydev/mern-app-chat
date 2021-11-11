const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const Conversation = require("../../src/models/Conversation");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  username: "phu",
  email: "phu@gmail.com",
  password: "23#21ghFsd_e",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY),
    },
  ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  username: "trang",
  email: "trang@gmail.com",
  password: "-0#21ghF86_e",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET_KEY),
    },
  ],
};

const conversationId = new mongoose.Types.ObjectId();
const conversation = {
  _id: conversationId,
  name: "Học CNM",
  members: [userOne],
};

const setupDBTest = async () => {
  await User.deleteMany({});
  await Conversation.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Conversation(conversation).save();
};

module.exports = { userOne, userTwo, conversation, setupDBTest };
