const express = require('express');
const friendsController = require('../controllers/FriendsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/friend-request', auth, friendsController.sendFriendRequest);
router.post(
    '/accept-friend-request',
    auth,
    friendsController.acceptFriendRequest,
);
router.get(
    '/get-list-friend-request',
    auth,
    friendsController.getListFriendsRequest,
);
router.get('/get-my-list-friend', auth, friendsController.getListFriends);
router.delete('/delete-friend', auth, friendsController.deleteFriend);

module.exports = router;
