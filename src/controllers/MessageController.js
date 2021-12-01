const Message = require("../models/Message");
const HttpError = require("../utils/http-error");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const fileUpload = require("../middleware/upload-file");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

class MessageController {
  async createMessage(req, res, next) {
    try {
      const { conversationId, text } = req.body;
      let findConversation;
      try {
        findConversation = await Conversation.findById(conversationId);
      } catch (error) {
        return next(new HttpError("Conversation not found", 404));
      }

      const newMessage = new Message({
        conversationId,
        sender: req.user._id.toString(),
        text,
        type: "text",
      });
      try {
        await newMessage.save();
      } catch (error) {
        return next(new HttpError("Can not save message, try again", 400));
      }
      res.status(201).send({ newMessage });
    } catch (error) {
      return next(new HttpError("Error system", 500));
    }
  }

  async getMessagesByConversation(req, res, next) {
    console.log(req.params.conversationId);
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });

      if (messages.length === 0 || !messages)
        return next(new HttpError("Can not get messages in conversation", 400));
      res.status(200).send({ messages });
    } catch (error) {
      return next(new HttpError("Error system", 500));
    }
  }

  async getLatestMessage(req, res, next) {
    try {
      const getLatestMessage = await Message.findOne({
        conversationId: req.params.conversationId,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!getLatestMessage)
        return next(new HttpError("Can not get latest messages by roomid"));
      res.status(200).send({ latestMessage: getLatestMessage });
    } catch (error) {
      return next(new HttpError("Error system", 500));
    }
  }
  async saveFileMessage(req, res, next) {
    try {
      if (!req.file) {
        console.log(err);
        throw next(new HttpError(err, 400));
      }
      const { conversationId } = req.body;

      const newFileMessage = new Message({
        conversationId,
        sender: req.user._id.toString(),
        text: `/uploads/files/${req.file.filename}`,
        type: "file",
      });
      try {
        await newFileMessage.save();
      } catch (error) {
        return next(new HttpError("Can not save file message", 500));
      }
      console.log(req.file);
      res.status(200).send({ newMessage: newFileMessage });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async saveImgMessage(req, res, next) {
    try {
      if (!req.file) {
        console.log(err);
        throw next(new HttpError(err, 400));
      }
      const { conversationId } = req.body;

      let outputFile = req.file.path + ".jpg";

      await sharp(req.file.path).jpeg({ quality: 80 }).toFile(outputFile);

      const newImgMessage = new Message({
        conversationId,
        sender: req.user._id.toString(),
        text: `/uploads/images/${req.file.filename}`,
        type: "img",
      });
      try {
        await newImgMessage.save();
      } catch (error) {
        return next(new HttpError("Can not save file message", 500));
      }
      console.log(req.file);
      res.status(200).send({ newMessage: newImgMessage });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }
}
module.exports = new MessageController();
