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
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjVaiSOyvsmxSZanpwXrMFftPxDxoMqYwKqw&usqp=CAU",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET_KEY),
    },
  ],
};

const userThreeId = new mongoose.Types.ObjectId();
const userThree = {
  _id: userThreeId,
  username: "thanh",
  email: "thanh@gmail.com",
  password: "567S#4_e",
  isAdmin: true,
  avatar:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjVaiSOyvsmxSZanpwXrMFftPxDxoMqYwKqw&usqp=CAU",
  tokens: [
    {
      token: jwt.sign({ _id: userThreeId }, process.env.JWT_SECRET_KEY),
    },
  ],
};

const conversationId = new mongoose.Types.ObjectId();
const conversation = {
  _id: conversationId,
  name: "Học CNM",
  members: [userOne],
  owner: userOne._id.toString(),
};

const setupDBTest = async () => {
  await User.deleteMany({});
  await Conversation.deleteMany({});
  await new User(userOne).save();
  await new User(userTwo).save();
  await new User(userThree).save();
  await new Conversation(conversation).save();
};

module.exports = { userOne, userTwo, conversation, setupDBTest, userThree };
