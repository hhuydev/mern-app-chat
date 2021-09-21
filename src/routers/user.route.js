const express = require("express");
const userController = require("../controllers/UserController");

const router = express.Router();

router.get("/me/:id", userController.getUser);
router.post("/", userController.create);
router.delete("/:id", userController.delete);
router.patch("/:id", userController.update);

module.exports = router;
