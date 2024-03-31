const express = require("express"); const { registerUser, currentUser, loginUser, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriends, } = require("../controllers/userController"); const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);

router.post("/friends", validateToken, sendFriendRequest);
router.put("/friends/:friendshipId", validateToken, acceptFriendRequest);
router.delete("/friends/:friendshipId", validateToken, rejectFriendRequest);
router.get("/friends", validateToken, getFriends);

module.exports = router;