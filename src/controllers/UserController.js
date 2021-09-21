const User = require("../models/User");

class UserController {
  async create(req, res, next) {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).send({ newUser });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async update(req, res, next) {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "email", "password"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) res.status(404).send({ error: "Invalid updates!" });

    try {
      const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updateUser) return res.send(404).send({ error: "Not found user!" });
      res.status(200).send({
        message: "Update user success",
        updateUser,
      });
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUser = await User.findByIdAndDelete(req.params.id);
      if (!deleteUser)
        return res.status(404).send({ error: "User not found!" });
      res.status(200).send({
        message: "Delete user success",
        deleteUser,
      });
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }

  async getUser(req, res, next) {
    try {
      const findUser = await User.findById(req.params.id);
      if (!findUser) return res.status(404).send({ error: "Not found user!" });
      res.send(findUser);
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  }
}

module.exports = new UserController();
