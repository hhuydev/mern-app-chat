const User = require('../models/User');
const HttpError = require('./http-error');
const users = [];

let savedRoomName;
const addUser = async ({ id, userId, room }) => {
    try {
        /**validate data */

        let user = await User.findById(userId);
        console.log(user);

        if (!user) return { error: 'Not found user' };

        let username = user.username;
        room = room.trim().toLowerCase();
        savedRoomName = room;
        if (!username || !room)
            return { error: 'Username & room are required!' };

        /**kiem tra thong user ton tai trong room chua */
        const existingUser = users.find(
            (user) => user.room === room && user.username === username,
        );

        if (existingUser) return { error: 'Server error!' };

        // const user = { id, username, room };
        const newUser = { id, username, room };

        /**them user moi vao arr users*/
        users.push(newUser);
        // return { user };
        return { user };
    } catch (error) {
        return { error: 'Server error!' };
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
    else return { user, savedRoomName };
};

const getUserInRoom = (roomName) => {
    const listUserByRoomName = users.filter((user) => user.room === roomName);
    if (listUserByRoomName.length !== 0) return listUserByRoomName;
    else return { error: 'Can not find users by ' + roomName };
};

module.exports = { addUser, removeUser, getUser, getUserInRoom, users };
