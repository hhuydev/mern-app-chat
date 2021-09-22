const express = require("express");
const friendsController = require("../controllers/FriendsController");

const router = express.Router();

router.post("/invite", friendsController.sendInviteFriend);
router.get("/:userId", friendsController.getListFriend);
router.delete("/delete", friendsController.deleteFriend);

module.exports = router;
