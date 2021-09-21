const express = require("express");
const conversationController = require("../controllers/ConversationController");

const router = express.Router();

router.get("/:userId", conversationController.getConverByUser);
router.post("/", conversationController.createConversation);
router.get(
  "/find/:firstUserId/:secondUserId",
  conversationController.getConverByUser
);

module.exports = router;
