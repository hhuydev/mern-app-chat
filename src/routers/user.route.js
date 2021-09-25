const express = require("express");
const userController = require("../controllers/UserController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.post("/logout", auth, userController.logout);

router.get("/me", auth, userController.getUser);
router.delete("/me/delete", auth, userController.delete);
router.patch("/me/update", auth, userController.update);

module.exports = router;
