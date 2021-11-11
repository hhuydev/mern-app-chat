const express = require('express');
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const uploadImg = require('../middleware/upload-img');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);

router.get('/me', auth, userController.getUser);
router.delete('/me/delete', auth, userController.delete);
router.patch('/me/update', auth, userController.update);

router.post(
    '/me/upload-avatar',
    auth,
    uploadImg.single('avatar'),
    userController.uploadAvatar,
);

router.delete('/me/delete-avatar', auth, userController.deleteAvatar);

router.post('/enable-2fa', auth, userController.postEnable2FA);

router.post('/verify-2fa', auth, userController.postVerify2FA);

router.get('/search-user/:email', userController.searchUser);

module.exports = router;
