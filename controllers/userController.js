const asyncHandler = require("express-async-handler"); const bcrypt = require("bcrypt"); const jwt = require("jsonwebtoken"); const { User, Friendship } = require("../models/userModel");
// User Operations

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
const { username, email, password } = req.body;
if (!username || !email || !password) {
res.status(400);
throw new Error("All fields are mandatory!");
}
const userAvailable = await User.findOne({ email });
if (userAvailable) {
res.status(400);
throw new Error("User already registered!");
}

//Hash password
const hashedPassword = await bcrypt.hash(password, 10);
console.log("Hashed Password: ", hashedPassword);
const user = await User.create({
username,
email,
password: hashedPassword,
});

console.log(`User created ${user}`);
if (user) {
res.status(201).json({ _id: user.id, email: user.email });
} else {
res.status(400);
throw new Error("User data is not valid");
}
res.json({ message: "Register the user" });
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
const { email, password } = req.body;
if (!email || !password) {
res.status(400);
throw new Error("All fields are mandatory!");
}
const user = await User.findOne({ email });
//compare password with hashedpassword
if (user && (await bcrypt.compare(password, user.password))) {
const accessToken = jwt.sign(
{
user: {
username: user.username,
email: user.email,
id: user.id,
},
},
process.env.ACCESS_TOKEN_SECERT,
{ expiresIn: "15m" }
);
res.status(200).json({ accessToken });
} else {
res.status(401);
throw new Error("email or password is not valid");
}
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
res.json(req.user);
});

// Friend Operations

//@desc Send friend request
//@route POST /api/users/friends
//@access private
const sendFriendRequest = asyncHandler(async (req, res) => {
const { friend_id } = req.body;
if (!friend_id) {
res.status(400);
throw new Error("Friend ID is required");
}

const existingFriendship = await Friendship.findOne({
$or: [
{ user_id: req.user.id, friend_id },
{ user_id: friend_id, friend_id: req.user.id },
],
});

if (existingFriendship) {
res.status(400);
throw new Error("Friend request already sent or received");
}

const friendship = await Friendship.create({
user_id: req.user.id,
friend_id,
});

res.status(201).json(friendship);
});

//@desc Accept friend request
//@route PUT /api/users/friends/:friendshipId
//@access private
const acceptFriendRequest = asyncHandler(async (req, res) => {
const friendship = await Friendship.findById(req.params.friendshipId);
if (!friendship) {
res.status(404);
throw new Error("Friend request not found");
}

if (friendship.friend_id.toString() !== req.user.id) {
res.status(403);
throw new Error("User don't have permission to accept this friend request");
}

friendship.status = "accepted";
await friendship.save();

res.status(200).json(friendship);
});

//@desc Reject friend request
//@route DELETE /api/users/friends/:friendshipId
//@access private
const rejectFriendRequest = asyncHandler(async (req, res) => {
const friendship = await Friendship.findById(req.params.friendshipId);
if (!friendship) {
res.status(404);
throw new Error("Friend request not found");
}

if (friendship.friend_id.toString() !== req.user.id) {
res.status(403);
throw new Error("User don't have permission to reject this friend request");
}

friendship.status = "rejected";
await friendship.save();

res.status(200).json(friendship);
});

//@desc Get friends
//@route GET /api/users/friends
//@access private
const getFriends = asyncHandler(async (req, res) => {
const friends = await Friendship.find({
$or: [
{ user_id: req.user.id, status: "accepted" },
{ friend_id: req.user.id, status: "accepted" },
],
}).populate("user_id friend_id", "username");

res.status(200).json(friends);
});

module.exports = {
registerUser,
loginUser,
currentUser,
sendFriendRequest,
acceptFriendRequest,
rejectFriendRequest,
getFriends,
};