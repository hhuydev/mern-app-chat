const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

class ConversationController {
  async getConverByUser(req, res, next) {
    try {
      const conversations = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).send({ conversations });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async createConversation(req, res, next) {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
      name: req.body.name,
    });
    try {
      await newConversation.save();
      res.status(201).send({ newConversation });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async getConversationByTwoUser(req, res, next) {
    try {
      const conversation = await Conversation.find({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).send({ conversation });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

module.exports = new ConversationController();
