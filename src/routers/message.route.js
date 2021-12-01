const express = require('express');
const messageController = require('../controllers/MessageController');
const auth = require('../middleware/auth');
const fileUpload = require('../middleware/upload-file');
const imgUpload = require('../middleware/upload-img');

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

router.post(
    '/create-file-message',
    auth,
    fileUpload.single('files'),
    messageController.saveFileMessage,
);
router.post(
    '/create-img-message',
    auth,
    imgUpload.single('photos'),
    messageController.saveImgMessage,
);

module.exports = router;
