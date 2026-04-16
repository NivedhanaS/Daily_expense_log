const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getUserData,
  updateUserData,
} = require("../controllers/userController");

router.get("/", auth, getUserData);
router.put("/", auth, updateUserData);


module.exports = router;