const exppress = require("express");
const adminController = require("../controllers/AdminController");
const auth = require("../middleware/auth");

const router = exppress.Router();

router.get("/getAllUser", auth, adminController.getAllUser);
router.post("/lockAccount", auth, adminController.lockingUserAccount);
router.post("/unlockAccount", auth, adminController.unlockUserAccount);
router.delete("/deleteAccount", auth, adminController.deleteUserAccount);

module.exports = router;
