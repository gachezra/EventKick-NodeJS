const mongoose = require("mongoose");
const eventSchema = mongoose.Schema(
{
uploader_id: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: "User",
},
title: {
type: String,
required: [true, "Please add the event title"],
},
description: {
type: String,
required: [true, "Please add the event description"],
},
location: {
type: String,
required: [true, "Please add the event location"],
},
date: {
type: Date,
required: [true, "Please add the event date"],
},
favorites: [
{
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
],
comments: [
{
user_id: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
text: {
type: String,
required: true,
},
createdAt: {
type: Date,
default: Date.now,
},
},
],
},
{
timestamps: true,
}
);

module.exports = mongoose.model("Event", eventSchema);