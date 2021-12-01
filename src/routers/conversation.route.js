const express = require('express');
const conversationController = require('../controllers/ConversationController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/get-conversations', auth, conversationController.getConversations);

router.post(
    '/create-conversation',
    auth,
    conversationController.createConversation,
);
router.get(
    '/get-conversation',
    auth,
    conversationController.getConversationByTwoUser,
);

router.get(
    '/get-conversation/:conversationId',
    conversationController.getConversationById,
);

router.post(
    '/invite-user-to-conversation',
    auth,
    conversationController.addUserToConversation,
);

router.post(
    '/remove-user-from-conversation',
    auth,
    conversationController.removeUserFromGroup,
);

router.post(
    '/leave-conversation',
    auth,
    conversationController.leavingConversation,
);

router.patch(
    '/update-conversation-name',
    auth,
    conversationController.updateConversationName,
);

router.delete(
    '/delete-conversation',
    auth,
    conversationController.deleteConversation,
);

router.patch(
    '/change-conversation-owner',
    auth,
    conversationController.changeOwnerConversation,
);

module.exports = router;
