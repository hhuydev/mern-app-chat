const Friends = require("../models/Friends");
const User = require("../models/User");

class FriendsController {
  async sendInviteFriend(req, res, next) {
    try {
      const sender = await User.findById(req.body.senderId);
      const receiver = await User.findById(req.body.receiverId);

      if (!sender) return res.status(404).send({ message: "User not found!" });
      if (!receiver)
        return res.status(404).send({ message: "Receiver not found!" });
      const friends = await Friends.findById(req.body.senderId);

      let newListFriend;
      if (friends) {
        friends.listFriend.push(req.body.receiverId);
        await friends.save();
        res.status(200).send({ friends });
      } else {
        console.log(req.body.receiverId);
        newListFriend = new Friends({
          senderId: sender._id,
        });
        newListFriend.listFriend.push(req.body.receiverId);

        await newListFriend.save();
        res.status(201).send({ newListFriend });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async getListFriend(req, res, next) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).send({ error: "User not found!" });
      const listFriend = await Friends.find({ senderId: user._id });

      res.status(200).send({ listFriend });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async deleteFriend(req, res, next) {
    try {
      const sender = await User.findById(req.body.senderId);
      const friend = await User.findById(req.body.friendId);

      if (!sender)
        return res.status(404).send({ message: "Sender not found!" });

      if (!friend)
        return res.status(404).send({ message: "Friend not found!" });

      const friends = await Friends.find({ senderId: req.body.senderId });

      const updateListFriend = friends.listFriend.filter(
        (friend) => friend !== req.body.friendId
      );
      console.log(updateListFriend);

      friends.listFriend = updateListFriend;
      await friends.save();
      res.status(200).send({ friends });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new FriendsController();
