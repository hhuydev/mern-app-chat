const Conversation = require('../models/Conversation');
const User = require('../models/User');
const HttpError = require('../utils/http-error');

class ConversationController {
    async getConversations(req, res, next) {
        try {
            const conversations = await Conversation.find()
                .where('members')
                .exists({
                    _id: req.user._id.toString(),
                });
            console.log(conversations);

            const filterConversations = conversations.filter((conv) =>
                conv.members.some(
                    (men) => men._id.toString() === req.user._id.toString(),
                ),
            );

            if (!conversations)
                return next(
                    new HttpError('Can not load conversations, try again', 500),
                );
            if (filterConversations.length === 0)
                return next(
                    new HttpError(
                        "You have not created conversation yet, let's create a conversation",
                        200,
                    ),
                );
            res.status(200).send({ conversations: filterConversations });
        } catch (error) {
            return next(new HttpError('System error', 500));
        }
    }
    async createConversation(req, res, next) {
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
            members: [req.user],
            name: req.body.name,
            owner: req.user._id,
            isGroup: true,
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
                (user) => user._id.toString() === inviteUser._id.toString(),
            );

            if (index !== -1)
                throw next(
                    new HttpError(
                        'User is participating conversation, can not invite',
                        400,
                    ),
                );

            findConversation.members.push(inviteUser);

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

            let checkOwnerConversation = await Conversation.findOne({
                _id: req.body.conversationId.toString(),
                owner: req.user._id.toString(),
            });
            if (checkOwnerConversation)
                return next(
                    new HttpError(
                        'You must change owner before leaving this conversation',
                        403,
                    ),
                );
            const updateConversationMembers = findConversation.members.filter(
                (userId) => userId._id.toString() !== req.user._id.toString(),
            );
            console.log(updateConversationMembers);
            try {
                findConversation.members = updateConversationMembers;
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

    async deleteConversation(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found', 404));
            let findConversation = await Conversation.findById(
                req.body.conversationId.toString(),
            );
            if (!findConversation)
                return next(new HttpError('Conversation not found', 404));

            let deleteConversation = await Conversation.findOneAndDelete({
                _id: req.body.conversationId,
                owner: req.user._id.toString(),
            });

            if (!deleteConversation)
                return next(new HttpError('You not allowed to do this', 403));
            res.status(200).send({ message: 'Delete success' });
        } catch (error) {
            throw next(new HttpError('System error', 500));
        }
    }

    async updateConversationName(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found', 404));
            let findConversation = await Conversation.findById(
                req.body.conversationId.toString(),
            );
            if (!findConversation)
                return next(new HttpError('Conversation not found', 404));

            const checkDuplicateNameConver = await Conversation.findOne({
                name: req.body.name,
            });
            if (checkDuplicateNameConver)
                return next(
                    new HttpError(
                        'This name is in used by another conversation, try another name',
                        400,
                    ),
                );
            else {
                let updateNameConversation =
                    await Conversation.findOneAndUpdate(
                        {
                            _id: req.body.conversationId,
                            owner: req.user._id.toString(),
                        },
                        { name: req.body.name },
                        { new: true },
                    );

                if (!updateNameConversation)
                    return next(
                        new HttpError('You not allowed to do this', 403),
                    );
                res.status(200).send({
                    message: 'Update conversation name success',
                });
            }
        } catch (error) {
            throw next(new HttpError('System error', 500));
        }
    }

    async changeOwnerConversation(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found', 404));
            let findConversation = await Conversation.findById(
                req.body.conversationId.toString(),
            );
            if (!findConversation)
                return next(new HttpError('Conversation not found', 404));

            let updateOwnerConversation = await Conversation.findOneAndUpdate(
                {
                    _id: req.body.conversationId,
                    owner: req.user._id.toString(),
                },
                { owner: req.body.userId },
                { new: true },
            );

            if (!updateOwnerConversation)
                return next(new HttpError('You not allowed to do this', 403));
            res.status(200).send({
                message: 'Change conversation owner success',
            });
        } catch (error) {
            throw next(new HttpError('System error', 500));
        }
    }
}

module.exports = new ConversationController();
