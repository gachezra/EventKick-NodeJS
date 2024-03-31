const express = require("express"); const router = express.Router(); const { getEvents, createEvent, getEvent, updateEvent, deleteEvent, addFavorite, removeFavorite, getFavorites, addComment, removeComment, getComments, } = require("../controllers/eventController"); const validateToken = require("../middleware/validateTokenHandler");
router.use(validateToken);
router.route("/").get(getEvents).post(createEvent);
router.route("/:id").get(getEvent).put(updateEvent).delete(deleteEvent);
router.route("/:id/favorites").post(addFavorite).delete(removeFavorite).get(getFavorites);
router.route("/:id/comments").post(addComment).delete(removeComment).get(getComments);

module.exports = router;