const Message = require('../models/Message');
const HttpError = require('../utils/http-error');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

class MessageController {
    async createMessage(req, res, next) {
        try {
            const { conversationId, text } = req.body;
            let findConversation;
            try {
                findConversation = await Conversation.findById(conversationId);
            } catch (error) {
                return next(new HttpError('Conversation not found', 404));
            }

            const newMessage = new Message({
                conversationId,
                sender: req.user._id.toString(),
                text,
            });
            try {
                await newMessage.save();
            } catch (error) {
                return next(
                    new HttpError('Can not save message, try again', 400),
                );
            }
            res.status(201).send({ newMessage });
        } catch (error) {
            return next(new HttpError('Error system', 500));
        }
    }

    async getMessagesByConversation(req, res, next) {
        try {
            const messages = await Message.find({
                conversationId: req.body.conversationId,
            });

            if (messages.length === 0 || !messages)
                return next(
                    new HttpError('Can not get messages in conversation', 400),
                );
            res.status(200).send({ messages });
        } catch (error) {
            return next(new HttpError('Error system', 500));
        }
    }

    async getLatestMessage(req, res, next) {
        try {
            const conversations = await Conversation.find({});
            const checkUserInConversation = conversations.forEach(
                (conver, index) =>
                    conver.members[index].toString() ===
                    req.user._id.toString(),
            );
            if (checkUserInConversation !== -1) {
                const getLatestMessage = await Message.find({
                    conversationId: req.body.conversationId,
                })
                    .sort({ createdAt: -1 })
                    .limit(1);
                if (!getLatestMessage)
                    return next(
                        new HttpError('Can not get latest messages by roomid'),
                    );
                res.status(200).send({ latestMessage: getLatestMessage });
            } else {
                return next(
                    new HttpError(
                        'You have not paticipated in this conversation',
                        400,
                    ),
                );
            }
        } catch (error) {
            return next(new HttpError('Error system', 500));
        }
    }
}
module.exports = new MessageController();
