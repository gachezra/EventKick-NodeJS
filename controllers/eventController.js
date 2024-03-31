const asyncHandler = require("express-async-handler"); const Event = require("../models/eventModel");
// Event Operations

//@desc Get all events
//@route GET /api/events
//@access private
const getEvents = asyncHandler(async (req, res) => {
const events = await Event.find();
res.status(200).json(events);
});

//@desc Create New event
//@route POST /api/events
//@access private
const createEvent = asyncHandler(async (req, res) => {
const { title, description, location, date } = req.body;
if (!title || !description || !location || !date) {
res.status(400);
throw new Error("All fields are mandatory !");
}
const event = await Event.create({
title,
description,
location,
date,
uploader_id: req.user.id,
});

res.status(201).json(event);
});

//@desc Get event
//@route GET /api/events/:id
//@access private
const getEvent = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}
res.status(200).json(event);
});

//@desc Update event
//@route PUT /api/events/:id
//@access private
const updateEvent = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}

if (event.uploader_id.toString() !== req.user.id) {
res.status(403);
throw new Error("User don't have permission to update this event");
}

const updatedEvent = await Event.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true }
);

res.status(200).json(updatedEvent);
});

//@desc Delete event
//@route DELETE /api/events/:id
//@access private
const deleteEvent = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}
if (event.uploader_id.toString() !== req.user.id) {
res.status(403);
throw new Error("User don't have permission to delete this event");
}
await Event.deleteOne({ _id: req.params.id });
res.status(200).json(event);
});

// Favorite Operations

//@desc Add favorite
//@route POST /api/events/:id/favorites
//@access private
const addFavorite = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}

if (event.favorites.includes(req.user.id)) {
res.status(400);
throw new Error("Event already favorited");
}

event.favorites.push(req.user.id);
await event.save();

res.status(200).json(event);
});

//@desc Remove favorite
//@route DELETE /api/events/:id/favorites
//@access private
const removeFavorite = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}

if (!event.favorites.includes(req.user.id)) {
res.status(400);
throw new Error("Event not favorited");
}

event.favorites = event.favorites.filter(
(favorite) => favorite.toString() !== req.user.id
);
await event.save();

res.status(200).json(event);
});

//@desc Get favorites
//@route GET /api/events/:id/favorites
//@access private
const getFavorites = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id).populate("favorites", "name");
if (!event) {
res.status(404);
throw new Error("Event not found");
}

res.status(200).json(event.favorites);
});

// Comment Operations

//@desc Add comment
//@route POST /api/events/:id/comments
//@access private
const addComment = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}

const { text } = req.body;
if (!text) {
res.status(400);
throw new Error("Comment text is required");
}

event.comments.push({ user_id: req.user.id, text });
await event.save();

res.status(200).json(event.comments);
});

//@desc Remove comment
//@route DELETE /api/events/:id/comments/:commentId
//@access private
const removeComment = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id);
if (!event) {
res.status(404);
throw new Error("Event not found");
}

const comment = event.comments.find(
(comment) => comment._id.toString() === req.params.commentId
);
if (!comment) {
res.status(404);
throw new Error("Comment not found");
}

if (comment.user_id.toString() !== req.user.id) {
res.status(403);
throw new Error("User don't have permission to delete this comment");
}

event.comments = event.comments.filter(
(comment) => comment._id.toString() !== req.params.commentId
);
await event.save();

res.status(200).json(event.comments);
});

//@desc Get comments
//@route GET /api/events/:id/comments
//@access private
const getComments = asyncHandler(async (req, res) => {
const event = await Event.findById(req.params.id).populate("comments.user_id", "name");
if (!event) {
res.status(404);
throw new Error("Event not found");
}

res.status(200).json(event.comments);
});

module.exports = {
getEvents,
createEvent,
getEvent,
updateEvent,
deleteEvent,
addFavorite,
removeFavorite,
getFavorites,
addComment,
removeComment,
getComments,
};