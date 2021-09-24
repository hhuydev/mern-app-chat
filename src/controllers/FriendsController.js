const Friends = require("../models/Friends");
const User = require("../models/User");
const HttpError = require("../utils/http-error");

class FriendsController {
  async sendFriendRequest(req, res, next) {
    try {
      const sender = await User.findById(req.body.senderId);
      // const sender = req.user;
      const receiver = await User.findById(req.body.receiverId);

      if (!sender) return next(new HttpError("User not found!", 404));
      if (!receiver) return next(new HttpError("Receiver not found!", 404));
      // const user2 = await User.findById(sender._id);
      // console.log(user2);
      const findExistingFriend = await Friends.findOne({
        senderId: req.body.senderId,
        friend: req.body.receiverId,
      });
      console.log(findExistingFriend);
      if (findExistingFriend)
        return next(
          new HttpError(
            "Can not send invite friend who already in your list friend",
            400
          )
        );

      let newListFriend;

      newListFriend = new Friends({
        senderId: sender.userId,
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
