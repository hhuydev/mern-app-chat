const exppress = require("express");
const adminController = require("../controllers/AdminController");

const router = exppress.Router();

router.get("/:adminId", adminController.getAllUser);
router.post("/:adminId/lockAccount", adminController.lockingUserAccount);
router.post("/:adminId/unlockAccount", adminController.unlockUserAccount);
router.delete("/:adminId/deleteAccount", adminController.deleteUserAccount);

module.exports = router;
