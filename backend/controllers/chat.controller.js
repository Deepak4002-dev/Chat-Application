import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

const createChat = catchAsync(async (req, res, next) => {
  const { otherId } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(otherId)) {
    throw new AppError("Invalid ID format", 401);
  }

  if (otherId.toString() === userId.toString()) {
    throw new AppError("You can't chat yourself", 400);
  }

  let chat = await Chat.findOne({
    isGroup: false,
    $or: [{ admin: userId }, { admin: otherId }],
    members: {
      $all: [userId, otherId],
      $size: 2,
    },
  }).populate("members", "username profilePic isOnline");

  if (!chat) {
    chat = await Chat.create({
      isGroup: false,
      admin: userId,
      members: [userId, otherId],
    });
  }

  res.status(200).json({
    status: "success",
    message: "Successfully chat created.",
    data: chat,
  });
});

const getPrviateMessages = catchAsync(async (req, res, next) => {
  const chatId = req.params.id;
  const userId = req.user._id;
  console.log(chatId);

  if (!mongoose.isValidObjectId(chatId)) {
    throw new AppError("Invalid ID format");
  }

  const messages = await Message.find({ chat: chatId }).populate(
    "sender seenBy",
    "username",
  );

  const chat = await Chat.findOne({ _id: chatId }).populate(
    "members",
    "username isOnline profilePic",
  );
  const otherUser = chat.members.find(
    (member) => member._id.toString() !== userId.toString(),
  );

  const chatData = {
    _id:chat._id,
    otherUser:otherUser,
    admin: chat.admin
  }

  res.status(200).json({
    status: "success",
    message: "Successfully fetched messages",
    data: {
      messages: messages,
      chat: chatData,
    },
  });
});

export { createChat, getPrviateMessages };
