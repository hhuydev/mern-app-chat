const express = require("express");
const messageController = require("../controllers/MessageController");
const auth = require("../middleware/auth");

const router = express.Router();

router.get(
  "/get-messaages-by-conversation",
  messageController.getMessagesByConversation
);
router.post("/create-message", auth, messageController.createMessage);

module.exports = router;
