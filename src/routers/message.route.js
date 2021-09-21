const express = require("express");
const messageController = require("../controllers/MessageController");

const router = express.Router();

router.get("/:conversationId", messageController.getByConversation);
router.post("/", messageController.createMessage);

module.exports = router;
