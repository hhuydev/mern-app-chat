const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const HttpError = require("../utils/http-error");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      min: 3,
      max: 30,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      min: 3,
      max: 30,
      lowercase: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Email is invalid!");
      },
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    city: {
      type: String,
      min: 2,
      max: 30,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  /**Dùng toObject() do mongoose cấp để trả về kiểu obj js */
  const userObject = this.toObject();
  /**Ẩn đi password, tokens, avatar khi gửi về client*/
  delete userObject.password;
  return userObject;
};

userSchema.methods.generateAuthToken = async function (next) {
  const user = this;

  let token;
  try {
    token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Can not generate token", 500));
  }

  return token;
};

userSchema.statics.findByCredentials = async (email, password, next) => {
  const user = await User.findOne({ email });
  if (!user) return next(new HttpError("Invalid user!", 404));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new HttpError("Email or pasword is invalid!", 404));
  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 8);
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
