const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const HttpError = require('../utils/http-error');

class ConversationController {
    async getConversations(req, res, next) {
        try {
            const conversations = await Conversation.find({
                members: { $in: [req.user._id.toString()] },
            });
            if (!conversations)
                return next(
                    new HttpError('Can not load conversations, try again', 500),
                );
            if (conversations.length === 0)
                return next(
                    new HttpError(
                        "You have not created conversation yet, let's create a conversation",
                        500,
                    ),
                );
            res.status(200).send({ conversations });
        } catch (error) {
            return next(new HttpError('System error', 500));
        }
    }
    async createConversation(req, res, next) {
        const findUser = await User.findOne({ email: req.body.email });
        if (!findUser) return next(new HttpError('User not found', 400));
        const existingNameConversation = await Conversation.findOne({
            name: req.body.name,
        });
        if (existingNameConversation)
            return next(
                new HttpError(
                    'Conversation name is in use, please choose another name',
                    400,
                ),
            );
        const newConversation = new Conversation({
            members: [req.user._id.toString(), findUser._id.toString()],
            name: req.body.name,
        });
        try {
            await newConversation.save();
            res.status(201).send({ newConversation });
        } catch (error) {
            return next(new HttpError('System error', 500));
        }
    }
    async getConversationByTwoUser(req, res, next) {
        try {
            const conversation = await Conversation.find({
                members: {
                    $all: [req.user._id.toString(), req.body.secondUserId],
                },
            });
            cm, res.status(200).send({ conversation });
        } catch (error) {
            return next(new HttpError('System error', 500));
        }
    }
    async addUserToConversation(req, res, next) {
        try {
            const inviteUser = await User.findOne({ email: req.body.email });
            const user = req.user;
            if (!user) throw next(new HttpError('User not found', 404));
            if (!inviteUser) throw next(new HttpError('Email not found', 404));
            const findConversation = await Conversation.findById(
                req.body.conversationId,
            );

            if (!findConversation)
                throw next(new HttpError('Conversation not found', 404));

            let index = findConversation.members.findIndex(
                (userId) => userId === inviteUser._id.toString(),
            );

            if (index !== -1)
                throw next(
                    new HttpError(
                        'User is participating conversation, can not invite',
                        400,
                    ),
                );

            findConversation.members.push(inviteUser._id.toString());

            try {
                await findConversation.save();
            } catch (error) {
                throw next(
                    new HttpError('Can not invite friend to conversation', 404),
                );
            }
            res.status(200).send({ message: 'Join success' });
        } catch (error) {
            throw next(new HttpError('System error', 500));
        }
    }

    async leavingConversation(req, res, next) {
        try {
            if (!req.user) throw next(new HttpError('User not found!', 404));
            const findConversation = await Conversation.findById(
                req.body.conversationId,
            );
            if (!findConversation)
                throw next(new HttpError('Conversation not found', 404));
            const updateConversationMembers = findConversation.members.filter(
                (userId) => userId !== req.user._id.toString(),
            );
            findConversation.members = updateConversationMembers;
            try {
                await findConversation.save();
            } catch (error) {
                throw next(
                    new HttpError('Has an error when leave conversation', 500),
                );
            }
            res.status(200).send({ message: 'Leaved conversation' });
        } catch (error) {
            throw next(new HttpError('System error', 500));
        }
    }
}

module.exports = new ConversationController();
