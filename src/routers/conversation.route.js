const express = require("express");
const conversationController = require("../controllers/ConversationController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/get-conversations", auth, conversationController.getConversations);
router.post(
  "/create-conversation",
  auth,
  conversationController.createConversation
);
router.get(
  "/get-conversation",
  auth,
  conversationController.getConversationByTwoUser
);
router.post(
  "/invite-user-to-conversation",
  auth,
  conversationController.addUserToConversation
);

module.exports = router;
