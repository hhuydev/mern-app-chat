const User = require("../models/User");
const HttpError = require("../utils/http-error");
const jwt = require("jsonwebtoken");

class UserController {
  async signUp(req, res, next) {
    try {
      const { email } = req.body;

      let findExistingUser = await User.findOne({ email });
      if (findExistingUser)
        return next(new HttpError("User existing. Please login instead", 422));
      else {
        const newUser = new User(req.body);
        try {
          await newUser.save();
        } catch (error) {
          return next(new HttpError("Signup failed, try again", 500));
        }

        let token;
        try {
          token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
          );
        } catch (error) {
          return next(new HttpError("Can not generate token", 500));
        }

        res.status(201).send({ newUser, token });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async login(req, res, next) {
    try {
      const userLogin = await User.findByCredentials(
        req.body.email,
        req.body.password,
        next
      );
      console.log(userLogin);
      let token;
      try {
        token = jwt.sign(
          { userId: userLogin._id, email: userLogin.email },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1h" }
        );
      } catch (error) {
        return next(new HttpError("Can not generate token", 500));
      }
      // const token = await userLogin.generateAuthToken();
      res.status(200).send({ userLogin, token });
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
