const express = require("express");
const friendsController = require("../controllers/FriendsController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/friendRequest", friendsController.sendFriendRequest);
router.get("/:userId", friendsController.getListFriend);
router.delete("/delete", friendsController.deleteFriend);

module.exports = router;
