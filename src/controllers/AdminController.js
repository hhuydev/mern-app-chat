const User = require('../models/User');
const HttpError = require('../utils/http-error');

class AdminController {
    async getAllUser(req, res, next) {
        try {
            const findAdmin = req.user;
            if (findAdmin.isAdmin) {
                const listUser = await User.find({});
                if (!listUser)
                    return next(new HttpError('Can not get list user', 400));
                res.status(200).send({ listUser });
            } else {
                return next(
                    new HttpError('Your account not allowed to do this', 401),
                );
            }
        } catch (error) {
            return res.status(500).send(error);
        }
    }
    async lockingUserAccount(req, res, next) {
        try {
            const findAdmin = req.user;
            if (findAdmin.isAdmin) {
                const findUserToLock = await User.findById(req.body.userId);
                if (!findUserToLock)
                    return res.status(404).send('User not found!');
                if (!findUserToLock.isLocked) {
                    findUserToLock.isLocked = true;
                    await findUserToLock.save();
                    res.status(200).send({
                        message: 'Locked user',
                        findUserToLock,
                    });
                } else {
                    return next(new HttpError('User account is locking', 400));
                }
            } else {
                return next(
                    new HttpError('Your account not allowed to do this', 401),
                );
            }
        } catch (error) {
            return next(new HttpError('System eror', 500));
        }
    }

    async unlockUserAccount(req, res, next) {
        try {
            const findAdmin = req.user;
            if (findAdmin.isAdmin) {
                const findUserToUnLock = await User.findById(req.body.userId);
                if (!findUserToUnLock)
                    return res.status(404).send('User not found!');
                if (findUserToUnLock.isLocked) {
                    findUserToUnLock.isLocked = false;
                    await findUserToUnLock.save();
                    res.status(200).send({
                        message: 'Unlocked User Account success',
                        findUserToUnLock,
                    });
                } else {
                    res.status(400).send({
                        message: 'User account is not locking',
                    });
                }
            } else
                res.status(401).send({
                    message: 'Your account not allowed to do this',
                });
        } catch (error) {
            return next(new HttpError('System eror', 500));
        }
    }

    async deleteUserAccount(req, res, next) {
        try {
            const findAdmin = req.user;
            if (findAdmin.isAdmin) {
                const findUserDelete = await User.findById(req.body.userId);
                if (!findUserDelete)
                    return res.status(404).send({ message: 'User not found!' });
                const deleteUser = await User.findByIdAndDelete(
                    req.body.userId,
                );
                await deleteUser;
                res.status(200).send({
                    message: 'Delete user success',
                    deleteUser,
                });
            } else
                res.status(401).send({
                    message: 'Your account not allowed to do this',
                });
        } catch (error) {
            return next(new HttpError('System eror', 500));
        }
    }
}
module.exports = new AdminController();
