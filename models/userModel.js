const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
{
username: {
type: String,
required: [true, "Please add the user name"],
},
email: {
type: String,
required: [true, "Please add the user email address"],
unique: [true, "Email address already taken"],
},
password: {
type: String,
required: [true, "Please add the user password"],
},
},
{
timestamps: true,
}
);

const friendshipSchema = mongoose.Schema(
{
user_id: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: "User",
},
friend_id: {
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: "User",
},
status: {
type: String,
enum: ["pending", "accepted", "rejected"],
default: "pending",
},
},
{
timestamps: true,
}
);

module.exports = {
User: mongoose.model("User", userSchema),
Friendship: mongoose.model("Friendship", friendshipSchema),
};