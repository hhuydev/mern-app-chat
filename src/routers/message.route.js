const express = require('express');
const messageController = require('../controllers/MessageController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get(
    '/get-messages-by-conversation/:conversationId',
    auth,
    messageController.getMessagesByConversation,
);
router.get(
    '/get-latest-message-by-conversation/:conversationId',
    auth,
    messageController.getLatestMessage,
);
router.post('/create-message', auth, messageController.createMessage);

module.exports = router;
