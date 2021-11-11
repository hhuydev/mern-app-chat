const Friends = require('../models/Friends');
const User = require('../models/User');
const FriendRequestStatus = require('../models/FriendRequestStatus');
const Conversation = require('../models/Conversation');
const HttpError = require('../utils/http-error');

class FriendsController {
    async sendFriendRequest(req, res, next) {
        try {
            console.log(req.body);
            const sender = req.user;
            const { email } = req.body;
            //   const receiverById = await User.findById(req.body.receiverId.toString());
            const receiverByMail = await User.findOne({ email });
            if (!sender) return next(new HttpError('User not found!', 404));
            if (!receiverByMail)
                return next(new HttpError('Receiver not found!', 404));

            if (
                // req.user._id.toString() === req.body.receiverId ||
                req.user.email === req.body.email
            )
                return next(
                    new HttpError(
                        'You can not send request friend by yourself!',
                        400,
                    ),
                );

            const findExistingFriend = await Friends.findOne({
                friends: { $in: [req.user._id.toString()] },
            });

            const findExistingFriend_2 = await Friends.findOne({
                friends: { $in: [receiverByMail._id.toString()] },
            });

            const findExistingFriendRequest = await FriendRequestStatus.findOne(
                {
                    senderId: req.user,
                    receiverId: receiverByMail,
                    status: 'WAITING',
                },
            );
            if (findExistingFriendRequest)
                return next(
                    new HttpError('Can not send friend request twice', 400),
                );

            const sendFriendRequest = new FriendRequestStatus({
                senderId: req.user,
                receiverId: receiverByMail,
                status: 'WAITING',
            });

            await sendFriendRequest.save();
            res.status(201).send({
                message: 'Sent friend request, wait to accept',
                sendFriendRequest,
            });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }
    //luu y sender trong body
    async acceptFriendRequest(req, res, next) {
        try {
            const receiver = req.user;
            if (!receiver) return next(new HttpError('User not found', 404));
            let findFriendRequest;
            const findSender = await User.findOne({ email: req.body.email });
            try {
                findFriendRequest = await FriendRequestStatus.findOne({
                    receiverId: receiver,
                    senderId: findSender,
                    status: 'WAITING',
                });
            } catch (error) {
                return next(new HttpError('Can not get friend request', 404));
            }
            if (!findFriendRequest) {
                return next(new HttpError('You have not friend request', 200));
            }

            findFriendRequest.status = 'ACCEPTED';
            await findFriendRequest.save();

            const user_1 = await User.findById(findFriendRequest.senderId);
            console.log(user_1);
            const user_2 = await User.findById(receiver._id);
            console.log(user_2);

            let newFriend = new Friends({
                friends: [user_1._id.toString(), user_2._id.toString()],
            });
            try {
                await newFriend.save();
            } catch (error) {
                return next(new HttpError('Can not create new friend', 500));
            }

            let newConversation = new Conversation({
                members: [user_1, user_2],
                name: `${user_1.username} - ${user_2.username}`,
            });
            try {
                await newConversation.save();
            } catch (error) {
                return next(new HttpError('Can not create conversation', 500));
            }

            res.status(201).send({
                message: 'Friend request accepted',
                newFriend,
                newConversation,
            });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }

    async cancelFriendRequest(req, res, next) {
        try {
            const receiver = req.user;
            if (!receiver) return next(new HttpError('User not found!'));
            const sender = await User.findOne({ email: req.body.email });
            console.log(sender);
            console.log(receiver);
            const findfriendRequest = await FriendRequestStatus.findOne({
                receiverId: receiver,
                senderId: sender,
                status: 'WAITING',
            });
            if (!findfriendRequest)
                return next(new HttpError('Friend request invalid!', 404));
            try {
                findfriendRequest.status = 'CANCELED';
                await findfriendRequest.save();
            } catch (error) {
                return next(new HttpError('Friend request invalid!', 404));
            }
            res.status(200).send({ message: 'Cancled friend request success' });
        } catch (error) {
            return next(new HttpError('server error', 500));
        }
    }

    async getListFriendsRequest(req, res, next) {
        try {
            const receiver = req.user;
            if (!receiver) return next(new HttpError('User not found!'));
            const listFriendRequest = await FriendRequestStatus.find({
                receiverId: receiver,
                status: 'WAITING',
            });
            let users = [];
            listFriendRequest.forEach((user) => users.push(user.senderId));
            if (listFriendRequest.length > 0) {
                return res.send({
                    message: 'success get list friend request',
                    users,
                });
            } else
                res.send({
                    message: 'You have not received friend request yet',
                });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }

    async getListFriends(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found!', 404));

            const listFriends = await FriendRequestStatus.find({
                status: 'ACCEPTED',
                $or: [{ senderId: user }, { receiverId: user }],
            });
            res.status(200).send({ listFriends });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }
    async deleteFriend(req, res, next) {
        try {
            const sender = req.user;
            const friend = await User.findById(req.body.userId.toString());

            if (!sender) return next(new HttpError('Sender not found!', 404));

            if (!friend) return next(new HttpError('Friend not found!', 404));

            const findExistingFriends = await Friends.find({
                senderId: sender._id,
            });
            const findExistingFriend = findExistingFriends.filter(
                (f) => f.friend === req.body.friendId,
            );
            if (findExistingFriend.length > 0) {
                const findFriend = await Friends.findOne({
                    friend: req.body.friendId,
                });

                const findFriendRequestDelete =
                    await FriendRequestStatus.findOne({
                        $or: [{ senderId: sender }, { receiverId: sender }],
                        status: 'ACCEPTED',
                    });
                if (!findFriendRequestDelete)
                    return next(new HttpError('request friend invalid', 404));
                findFriendRequestDelete.status = 'CANCELED';

                try {
                    await findFriendRequestDelete.save();
                } catch (error) {
                    return next(
                        new HttpError(
                            'unsuccess update friend request status',
                            500,
                        ),
                    );
                }
                // const friends = await Friends.findByIdAndDelete();
                // try {
                //   await friends.save();
                // } catch (error) {
                //   return next(new HttpError("unsuccess delete friend", 500));
                // }

                res.status(200).send({ message: 'Unfriend success' });
            } else {
                return next(new HttpError('user not on your list friend', 400));
            }
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }
}

module.exports = new FriendsController();
