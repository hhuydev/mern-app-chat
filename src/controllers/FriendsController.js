const Friends = require('../models/Friends');
const User = require('../models/User');
const FriendRequestStatus = require('../models/FriendRequestStatus');
const HttpError = require('../utils/http-error');

let save_sender;
class FriendsController {
    async sendFriendRequest(req, res, next) {
        try {
            const sender = req.user;
            const receiver = await User.findById(req.body.receiverId);

            if (!sender) return next(new HttpError('User not found!', 404));
            if (!receiver)
                return next(new HttpError('Receiver not found!', 404));

            if (req.user._id.toString() === req.body.receiverId)
                return next(
                    new HttpError(
                        'You can not send request friend by yourself!',
                        400,
                    ),
                );

            const findExistingFriend = await Friends.findOne({
                senderId: req.user._id.toString(),
                friend: req.body.receiverId,
            });

            const findExistingFriend_2 = await Friends.findOne({
                senderId: req.body.receiverId,
                friend: req.user._id.toString(),
            });
            if (findExistingFriend || findExistingFriend_2)
                return next(
                    new HttpError(
                        'Can not send friend request who already in your list friend',
                        400,
                    ),
                );
            const findExistingFriendRequest = await FriendRequestStatus.findOne(
                {
                    senderId: req.user._id,
                    receiverId: req.body.receiverId,
                    status: 'WAITING',
                },
            );
            if (findExistingFriendRequest)
                return next(
                    new HttpError('Can not send friend request twice', 400),
                );

            const sendFriendRequest = new FriendRequestStatus({
                senderId: req.user._id,
                receiverId: req.body.receiverId,
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

    async acceptFriendRequest(req, res, next) {
        try {
            const receiver = req.user;
            if (!receiver) return next(new HttpError('User not found', 404));
            const findFriendRequest = await FriendRequestStatus.findOne({
                receiverId: receiver._id,
            });
            if (!findFriendRequest) {
                return next(new HttpError('You have not friend request', 400));
            }
            const findSentFriendRequest = await FriendRequestStatus.findOne({
                receiverId: receiver._id,
            });

            findFriendRequest.status = 'ACCEPTED';
            await findFriendRequest.save();

            let newFriend = new Friends({
                senderId: findFriendRequest.senderId,
                friend: receiver._id,
            });
            await newFriend.save();
            res.status(201).send({
                message: 'Friend request accepted',
                newFriend,
            });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }

    async getListFriend(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found!', 404));
            const listFriend = await Friends.find({
                $or: [{ senderId: user._id }, { friend: user._id }],
            });
            res.status(200).send({ listFriend });
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }
    async deleteFriend(req, res, next) {
        try {
            const sender = req.user;
            const friend = await User.findById(req.body.friendId);

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

                const friends = await Friends.findByIdAndDelete(findFriend._id);

                res.status(200).send({ message: 'Unfriend success', friends });
            } else {
                return next(
                    new HttpError('He or she not on your list friend', 400),
                );
            }
        } catch (error) {
            return next(new HttpError('Server error', 500));
        }
    }
}

module.exports = new FriendsController();
