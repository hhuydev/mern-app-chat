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
      const findExistingFriend = await Friends.findOne({
        senderId: req.body.senderId,
        friend: req.body.receiverId,
      });

      if (findExistingFriend)
        return res.status(404).send({
          message: "Can not send invite friend who already in your list friend",
        });

      let newListFriend;

      console.log(req.body.receiverId);
      newListFriend = new Friends({
        senderId: sender._id,
        friend: req.body.receiverId,
      });

      await newListFriend.save();
      res.status(201).send({ newListFriend });
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

      const findFriend = await Friends.findOne({ friend: req.body.friendId });

      const friends = await Friends.findByIdAndDelete(findFriend._id);

      res.status(200).send({ message: "Unfriend success", friends });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new FriendsController();
