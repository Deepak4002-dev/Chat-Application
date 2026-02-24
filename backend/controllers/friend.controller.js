import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";
import { getIO } from "../config/socket.js";

const request = catchAsync(async (req, res, next) => {
  const { receiver_id } = req.body;
  if (!mongoose.isValidObjectId(req.body.receiver_id)) {
    throw new AppError("Invalid receiver ID", 400);
  }

  const senderId = req.user._id;
  const receiverId = receiver_id;

  if (senderId.toString() === receiver_id.toString()) {
    throw new AppError("You cannot send a request to yourself", 400);
  }

  const existing = await Friend.findOne({
    $or: [
      { sender: senderId,   receiver: receiverId },  // A already sent to B
      { sender: receiverId, receiver: senderId },    // B already sent to A
    ],
  });

  if (existing) {
    throw new AppError("Request already exists", 400);
  }

  const newRequest = new Friend({
    sender: senderId,
    receiver: receiverId,
    status:"pending"
  });

  const savedRequest = await newRequest.save();

  const populated = await Friend.findById(savedRequest._id).populate(
    "sender",
    "username profilePic",
  );

  const targetRoom = receiverId.toString();
  console.log(`[Friend] Emitting newRequest to room: ${targetRoom}`);
  getIO().to(targetRoom).emit("newRequest", {
    requestId: savedRequest._id,
    sender: populated.sender,
    status: savedRequest.status,
  });

  res.status(201).json({
    status: "success",
    message: "Friend request sent",
    data: newRequest,
  });
});

const notifyRequest = catchAsync(async (req, res, next) => {
  const pendingRequests = await Friend.find({
    receiver: req.user._id,
    status: "pending",
  }).populate("sender", "username profilePic");

  if (!pendingRequests && pendingRequests.length === 0) {
    throw new AppError("No pending requests", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Here are pending requests",
    data: pendingRequests,
  });
});

const accept = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;
  const userId = req.user._id;

  if (!requestId) {
    throw new AppError("Invalid ID", 400);
  }

  if (!mongoose.isValidObjectId(requestId)) {
    throw new AppError("Invalid ID format", 400);
  }

  const existingRequest = await Friend.findOne({
    _id: requestId,
    receiver: userId,
    status: "pending",
  });

  if (!existingRequest) {
    throw new AppError("Friend request not found", 404);
  }

  existingRequest.status = "accepted";
  await existingRequest.save();

  res.status(200).json({
    status: "success",
    message: "Friend request accepted",
  });
});

const reject = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;
  const userId = req.user._id;

  const existingRequest = await Friend.findOneAndDelete({
    _id: requestId,
    receiver: userId, // only receiver can reject
    status: "pending",
  });

  if (!existingRequest) {
    throw new AppError("Friend request not found", 404);
  }

  res
    .status(200)
    .json({ status: "success", message: "Friend request rejected" });
});

const cancel = catchAsync(async (req, res, next) => {
  const requestId = req.params.id;
  const userId = req.user._id;

  const existingRequest = await Friend.findOneAndDelete({
    _id: requestId,
    sender: userId, // only sender can cancel
    status: "pending",
  });

  if (!existingRequest) {
    throw new AppError("Friend request not found", 404);
  }

  res
    .status(200)
    .json({ status: "success", message: "Friend request cancelled" });
});

const getFriends = catchAsync(async (req, res, next) => {
  const friends = await Friend.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    status: "accepted",
  }).populate("sender receiver", "username profilePic isOnline");

  console.log(friends);

  res
    .status(200)
    .json({ message: "Sucessfully fetched friends", data: friends });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const myId = req.user._id;

  const allusers = await User.find({ _id: { $ne: myId } }).select(
    "username profilePic isOnline",
  );

  const allfriendships = await Friend.find({
    $or: [{ sender: myId }, { receiver: myId }],
  });

  const relationshipMap = new Map();

  allfriendships.forEach((f) => {
    const isSender = f.sender.toString() === myId.toString();
    const otherUserId = isSender ? f.receiver.toString() : f.sender.toString();

    relationshipMap.set(otherUserId, {
      requestId: f._id,
      status: f.status,
      direction: isSender ? "sent" : "received",
    });
  });

  const all = allusers.map((user) => {
    const rel = relationshipMap.get(user._id.toString());

    let friendStatus = "none";
    let requestId = null;

    if (rel) {
      requestId = rel.requestId;
      if (rel.status === "accepted") {
        friendStatus = "friend";
      } else if (rel.status === "pending" && rel.direction === "sent") {
        friendStatus = "request_sent"; // I sent → show "Request Sent" + Cancel button
      } else if (rel.status === "pending" && rel.direction === "received") {
        friendStatus = "request_received"; // They sent → show Accept/Reject buttons
      }
      // "rejected" falls through to "none" — allow re-sending
    }
    return {
      ...user._doc,
      friendStatus,
      requestId,
    };
  });

  res.status(200).json({
    status: "success",
    message: "Successfully fetched all users",
    data: all,
  });
});

export {
  request,
  accept,
  reject,
  notifyRequest,
  getFriends,
  getAllUsers,
  cancel,
};
