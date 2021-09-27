const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const HttpError = require("../utils/http-error");

class ConversationController {
  async getConversations(req, res, next) {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.user._id.toString()] },
      });
      if (!conversations)
        return next(
          new HttpError("Can not load conversations, try again", 500)
        );
      if (conversations.length === 0)
        return next(
          new HttpError(
            "You have not created conversation yet, let's create a conversation",
            500
          )
        );
      res.status(200).send({ conversations });
    } catch (error) {
      return next(new HttpError("System error", 500));
    }
  }
  async createConversation(req, res, next) {
    const newConversation = new Conversation({
      members: [req.user._id.toString(), req.body.receiverId],
      name: req.body.name,
    });
    try {
      await newConversation.save();
      res.status(201).send({ newConversation });
    } catch (error) {
      return next(new HttpError("System error", 500));
    }
  }
  async getConversationByTwoUser(req, res, next) {
    try {
      const conversation = await Conversation.find({
        members: { $all: [req.user._id.toString(), req.body.secondUserId] },
      });
      res.status(200).send({ conversation });
    } catch (error) {
      return next(new HttpError("System error", 500));
    }
  }
  async addUserIntoConversation(req, res, next) {
    try {
      // const userInConversation = await Conversation.find({
      //   members: { $in: [req.user._id.toString()] },
      // });
      // if(userInConversation)
    } catch (error) {
      return next(new HttpError("System error", 500));
    }
  }
}

module.exports = new ConversationController();
