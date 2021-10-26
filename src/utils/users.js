const User = require("../models/User");
const HttpError = require("./http-error");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;
const users = [];

const validateToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decodedToken.userId);
  } catch (error) {}
};
let savedRoom;
const addUser = async ({ id, userId, room }) => {
  try {
    /**validate data */

    let user = await User.findById(new ObjectId(userId));

    if (!user) return { error: "Not found user" };

    let username = user.username;
    room = room.trim().toLowerCase();
    savedRoom = room;
    if (!username || !room) return { error: "Username & room are required!" };

    /**kiem tra thong user ton tai trong room chua */
    const existingUser = users.find(
      (user) => user.room === room && user.username === username
    );

    if (existingUser) return { error: "User is in use!" };

    // const user = { id, username, room };
    const newUser = { id, username, room };

    /**them user moi vao arr users*/
    users.push(newUser);
    // return { user };
    return { user };
  } catch (error) {
    return { error: "Server error!" };
  }
};
const removeUser = async (id) => {
  const index = users.findIndex((user) => user.id === id);
  /**remove user tra ve user[0] */
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = async (id) => {
  // const index = users.findIndex((user) => user.id === id);
  // if (index !== -1) return users[index];
  // else return undefined;
  const user = await User.findById(id);
  if (!user) return undefined;
  else return { user, savedRoom };
};

const getUserInRoom = (roomName) => {
  const listUserByRoomName = users.filter((user) => user.room === roomName);
  if (listUserByRoomName.length !== 0) return listUserByRoomName;
  else return { error: "Can not find users by " + roomName };
};

module.exports = { addUser, removeUser, getUser, getUserInRoom, users };
