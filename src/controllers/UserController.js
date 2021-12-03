const User = require("../models/User");
const HttpError = require("../utils/http-error");
const jwt = require("jsonwebtoken");
const { sendVerifyEmail } = require("../utils/send-mail");
const {
  generateUniqueSecret,
  totpGenerate,
  validateTotp,
} = require("../utils/2fa");

class UserController {
  async signUp(req, res, next) {
    try {
      const { email, username } = req.body;
      console.log(email, username);
      let findExistingUser = await User.findOne({ email });
      if (findExistingUser)
        return next(new HttpError("User existing. Please login instead", 422));
      else {
        const newUser = new User({
          ...req.body,
          avatar:
            "https://firebasestorage.googleapis.com/v0/b/myappchat-25ec5.appspot.com/o/public%2Fimage%2Favatar%2Favatar_default.jpg?alt=media&token=fafa20de-4d90-422c-9740-abc678f426b2",
        });
        newUser.isOnline = true;
        newUser.isLocked = true;
        // newUser.secret = generateUniqueSecret();
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
        // sendWelcomeEmail(email, username);
        const secret = generateUniqueSecret();
        if (!secret) {
          return next(new HttpError("Can not generate secret", 500));
        }

        res.status(201).send({
          user: newUser,
          token,
          isCorrectIdentifier: true,
          secret: secret.base32,
        });
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

      res.status(200).send({
        user: userLogin,
        token,
      });
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
    const allowedUpdates = ["username", "email", "password", "avatar"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) res.status(404).send({ error: "Invalid updates!" });

    try {
      //   const updateUser = req.user;
      //   if (!updateUser) return res.send(404).send({ error: "Not found user!" });

      //   updates.forEach((update) => (updateUser[update] = req.body[update]));

      const findId = { _id: req.user._id.toString() };
      const updateUser = await User.findOneAndUpdate(findId, req.body, {
        new: true,
        runValidators: true,
      });
      //   await updateUser.save();

      res.status(200).send({
        message: "Update user success",
        user: updateUser,
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
      });
      // sendCancleEmail(deleteUser.email, deleteUser.username);
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  getUser(req, res, next) {
    res.status(200).send({ user: req.user });
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) return next(new HttpError("User not found", 500));
      else res.status(200).send({ user });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const user = req.user;
      if (!user) return next(new HttpError("User not found!", 404));
      if (!req.file) return next(new HttpError("File not found!", 404));
      if (user.avatar.length > 0)
        return next(
          new HttpError(
            "Please delete avatar in use before upload new avatar!",
            400
          )
        );
      // user.avatar = req.file.path;
      user.avatar = `/uploads/images/${req.file.filename}`;
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
        return next(new HttpError("You have not uploaded avatar yet!", 400));
      user.avatar = "";
      try {
        await user.save();
      } catch (error) {
        return next(new HttpError("Can not delete avatar, try again!", 500));
      }
      res.status(200).send({ message: "Delete avatar success" });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async postEnable2FA(req, res, next) {
    try {
      const user = req.user;
      //   const serviceName = "AloAlo App Chat";
      //   const otpAuth = generateOTPToken(user.username, serviceName, user.secret);
      //   const QRCodeImage = await generateQRCode(otpAuth);
      const otpAuth2 = totpGenerate(req.body.secret);
      sendVerifyEmail(user.email, otpAuth2.token);
      res.status(200).send({ otpAuth2 });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async postVerify2FA(req, res, next) {
    try {
      const user = req.user;
      if (!user) return next(new HttpError("User not found!", 404));
      const { otpToken } = req.body;
      if (!otpToken) return next(new HttpError("Can not get otp token!", 404));
      //   const isValid = verifyOTPToken(otpToken, user.secret);

      const isValid = validateTotp(req.body.secret, otpToken);
      console.log(isValid);
      if (!isValid) {
        return next(new HttpError("Your account is not verified", 401));
      } else {
        try {
          user.isLocked = false;
          await user.save();
        } catch (error) {
          return next(new HttpError("Server error", 500));
        }
        res.status(200).send({ message: "Your account is verified" });
      }
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }

  async searchUser(req, res, next) {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) return next(new HttpError("User not found", 404));
      res.send({ user });
    } catch (error) {
      return next(new HttpError("Server error", 500));
    }
  }
}

module.exports = new UserController();
