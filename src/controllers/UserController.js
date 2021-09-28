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
        newUser.isOnline = true;
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
      return next(new HttpError("Server error", 500));
    }
  }

  async login(req, res, next) {
    try {
      const userLogin = await User.findByCredentials(
        req.body.email,
        req.body.password,
        next
      );
      if (userLogin.isLocked)
        return next(
          new HttpError("Login failed, your account was locked by admin", 400)
        );
      userLogin.isOnline = true;
      try {
        await userLogin.save();
      } catch (error) {
        return next(new HttpError("Login failed, try again", 500));
      }
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

      res.status(200).send({ userLogin, token });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async logout(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      user.isOnline = false;
      try {
        await user.save();
      } catch (error) {
        return next(new HttpError("Logout failed, try again", 500));
      }
      req.token = null;
      res.status(200).send({ message: "Logout success" });
    } catch (error) {
      return next(new HttpError("Server error", 500));
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
      const updateUser = req.user;
      if (!updateUser) return res.send(404).send({ error: "Not found user!" });

      updates.forEach((update) => (updateUser[update] = req.body[update]));
      await updateUser.save();

      res.status(200).send({
        message: "Update user success",
        updateUser,
      });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async delete(req, res, next) {
    try {
      const deleteUser = req.user;
      if (!deleteUser)
        return res.status(404).send({ error: "User not found!" });
      await req.user.remove();
      res.status(200).send({
        message: "Delete user success",
        deleteUser,
      });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  getUser(req, res, next) {
    res.send(req.user);
  }

  async uploadAvatar(req, res, next) {
    try {
      const user = req.user;
      if (!user) return next(new HttpError("User not found!", 404));
      if (!req.file) return next(new HttpError("File not found!", 404));

      user.avatar = req.file.path;
      try {
        await user.save();
      } catch (error) {
        return next(new HttpError("Failed to upload avatar, try again", 400));
      }
      res.status(200).send({ message: "Upload avatar success", user });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async deleteAvatar(req, res, next) {
    try {
      const user = req.user;
      if (!user) return next(new HttpError("User not found!", 404));
      if (user.avatar.length === 0)
        return next(new HttpError("You have not uploaded avatar yet!", 404));
      user.avatar = "";
      try {
        await user.save();
      } catch (error) {
        return next(new HttpError("Can not delete avatar, try again!", 500));
      }
      res.status(200).send({ message: "Delete avatar success", user });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }
}

module.exports = new UserController();
