const User = require("../models/User");

class AdminController {
  async getAllUser(req, res, next) {
    try {
      const findAdmin = await User.findOne({
        _id: req.params.adminId,
      });
      if (findAdmin.isAdmin) {
        const listUser = await User.find({});
        if (!listUser)
          return res.status(500).send({ message: "Can not get list user" });
        res.status(200).send({ listUser });
      } else {
        res
          .status(401)
          .send({ message: "Your account not allowed to do this" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async lockingUserAccount(req, res, next) {
    try {
      const findAdmin = await User.findOne({
        _id: req.params.adminId,
      });
      if (findAdmin.isAdmin) {
        const findUserToLock = await User.findById(req.body.userId);
        if (!findUserToLock) return res.status(404).send("User not found!");
        if (!findUserToLock.isLocked) {
          findUserToLock.isLocked = true;
          await findUserToLock.save();
          res.status(200).send({ message: "Locked user", findUserToLock });
        } else {
          res.status(400).send({ message: "User account is locking" });
        }
      } else {
        res
          .status(401)
          .send({ message: "Your account not allowed to do this" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async unlockUserAccount(req, res, next) {
    try {
      const findAdmin = await User.findOne({
        _id: req.params.adminId,
      });
      if (findAdmin.isAdmin) {
        const findUserToUnLock = await User.findById(req.body.userId);
        if (!findUserToUnLock) return res.status(404).send("User not found!");
        if (findUserToUnLock.isLocked) {
          findUserToUnLock.isLocked = false;
          await findUserToUnLock.save();
          res
            .status(200)
            .send({
              message: "Unlocked User Account success",
              findUserToUnLock,
            });
        } else {
          res.status(400).send({ message: "User account is not locking" });
        }
      } else
        res
          .status(401)
          .send({ message: "Your account not allowed to do this" });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async deleteUserAccount(req, res, next) {
    try {
      const findAdmin = await User.findOne({
        _id: req.params.adminId,
      });
      if (findAdmin.isAdmin) {
        const findUserDelete = await User.findById(req.body.userId);
        if (!findUserDelete)
          return res.status(404).send({ message: "User not found!" });
        const deleteUser = await User.findByIdAndDelete(req.body.userId);
        await deleteUser;
        res.status(200).send({ message: "Delete user success", deleteUser });
      } else
        res
          .status(401)
          .send({ message: "Your account not allowed to do this" });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
module.exports = new AdminController();
