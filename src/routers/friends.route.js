const express = require("express");
const friendsController = require("../controllers/FriendsController");

const router = express.Router();

router.post("/invite", friendsController.sendFriendRequest);
router.get("/:userId", friendsController.getListFriend);
router.delete("/delete", friendsController.deleteFriend);

module.exports = router;
