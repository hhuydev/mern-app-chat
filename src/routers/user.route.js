const express = require("express");
const userController = require("../controllers/UserController");

const router = express.Router();

router.get("/me/:id", userController.getUser);
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.delete("/:id", userController.delete);
router.patch("/:id", userController.update);

module.exports = router;
