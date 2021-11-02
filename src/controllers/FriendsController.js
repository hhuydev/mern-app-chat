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
            // const templateName = `${req.user.username} - ${receiverByMail.username}`;
            // const templateName2 = `${receiverByMail.username} - ${req.user.username}`;

            // const findExistingFriend = await Conversation.findOne()
            //   .where("name")
            //   .exists(templateName);
            // const findExistingFriend2 = await Conversation.findOne()
            //   .where("name")
            //   .exists(templateName2);

            // if (findExistingFriend || findExistingFriend_2)
            //   return next(
            //     new HttpError(
            //       "Can not send friend request who already in your list friend",
            //       400
            //     )
            //   );
            const findExistingFriendRequest = await FriendRequestStatus.findOne(
                {
                    senderId: req.user._id.toString(),
                    receiverId: receiverByMail._id.toString(),
                    status: 'WAITING',
                },
            );
            if (findExistingFriendRequest)
                return next(
                    new HttpError('Can not send friend request twice', 400),
                );

            const sendFriendRequest = new FriendRequestStatus({
                senderId: req.user._id.toString(),
                receiverId: receiverByMail._id.toString(),
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
            let findFriendRequest;
            try {
                findFriendRequest = await FriendRequestStatus.findOne({
                    receiverId: receiver._id.toString(),
                    status: 'WAITING',
                });
            } catch (error) {
                return next(new HttpError('Can not found user', 404));
            }
            // console.log(findFriendRequest);
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

    async getListFriend(req, res, next) {
        try {
            const user = req.user;
            if (!user) return next(new HttpError('User not found!', 404));
            //   const listFriend = await Friends.find({
            //     $or: [{ senderId: user._id }, { friend: user._id }],
            //   });

            const requestFriend = await FriendRequestStatus.find({
                status: 'ACCEPTED',
                $or: [{ senderId: user._id }, { receiverId: user._id }],
            });
            const tempArr = [req.user._id.toString()];
            const listFriend = await Friends.find({
                friends: { $in: tempArr },
            });
            // let filterFriends = [];

            // for (let item of listFriend) {
            //  const findFriend = await User.findById(item._id.toString())
            // filterFriends.push(findFriend)
            // }

            res.status(200).send({ requestFriend, listFriend });
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
