const Message = require("../models/Message");

class MessageController {
  async createMessage(req, res, next) {
    const newMessage = new Message(req.body);
    try {
      await newMessage.save();
      res.status(201).send({ newMessage });
    } catch (error) {}
  }

  async getByConversation(req, res, next) {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).send({ messages });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
module.exports = new MessageController();
