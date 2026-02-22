import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Friend from "../models/Friend.js";
import User from "../models/User.js";

const request = catchAsync(async (req, res, next) => {
  if (mongoose.isValidObjectId(req.body.receiver_id)) {
    throw new AppError("Invalid request", 401);
  }

  const senderId = req.user._id;
  const receiverId = req.body._id;

  if (senderId === receiverId) {
    return new AppError("Invalid request", 401);
  }

  const existing = await Friend.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { receiver: receiverId, sender: senderId },
    ],
  });
  if (existing) {
    return new AppError("Request already exists", 400);
  }
  const newRequest = new Friend({
    sender: senderId,
    receiver: receiverId,
  });

  await newRequest.save();
});

const notifyRequest = catchAsync(async (req, res, next) => {
  const pendingRequests = await Friend.find({
    receiver: req.user._id,
    status: "pending",
  }).populate("sender", "username profilePic");
  if (!pendingRequests && !pendingRequests.length > 0) {
    return new AppError("No pending requests", 404);
  }

  res
    .status(200)
    .json({ message: "Here are pending requests", data: pendingRequests });
});

const accept = catchAsync(async (req, res, next) => {
  const receiverId = req.params.id;
  if (!receiverId) {
    return new AppError(" ID Not found", 404);
  }

  if (!mongoose.isValidObjectId(receiverId)) {
    return new AppError("Invalide Id", 400);
  }

  const existingRequest = await Friend.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { receiver: receiverId, sender: senderId },
    ],
  });

  if (existingRequest) {
    return new AppError("No longer request exists", 404);
  }

  existingRequest.status = "accepted";
  await existingRequest.save();
});

const reject = catchAsync(async (req, res, next) => {
   const receiverId = req.params.id;
  if (!receiverId) {
    return new AppError(" ID Not found", 404);
  }

  if (!mongoose.isValidObjectId(receiverId)) {
    return new AppError("Invalide Id", 400);
  }

  const existingRequest = await Friend.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { receiver: receiverId, sender: senderId },
    ],
  });

  if (existingRequest) {
    return new AppError("No longer request exists", 404);
  }

  existingRequest.status = "rejected";
  await existingRequest.save();
});


const getFriends = catchAsync(async (req,res,next)=>{
  console.log("hit api")
  console.log(req.user)
   const friends = await Friend.find({
    $or:[
      {sender:req.user._id},
      {receiver:req.user._id}
    ]
   }).populate("sender receiver","username");

   res.status(200).json({message:"sucessfully fetched friends",data:friends});
})

const getAllFriends = catchAsync(async (req,res,next)=>{
  const allusers = await User.find().select('-role -email');
  res.status(200).json({message:"successfully fetched all users", data:allusers});
})

export { request, accept, reject, notifyRequest, getFriends, getAllFriends };
