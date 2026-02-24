import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { getIO } from "../config/socket.js";

const createChat = catchAsync(async (req, res, next) => {
  const { otherId } = req.body;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(otherId)) {
    throw new AppError("Invalid ID format", 400);
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

  if (!mongoose.isValidObjectId(chatId)) {
    throw new AppError("Invalid ID format", 400);
  }

  const chat = await Chat.findOne({ _id: chatId }).populate(
    "members",
    "username isOnline profilePic",
  );
  if (!chat) throw new AppError("Chat not found", 404);

  const isMember = chat.members.some(
    (m) => m._id.toString() === userId.toString(),
  );
  if (!isMember) throw new AppError("You are not a member of this chat", 403);

  const messages = await Message.find({ chat: chatId }).populate(
    "sender seenBy",
    "username",
  );

  const otherUser = chat.members.find(
    (member) => member._id.toString() !== userId.toString(),
  );

  const chatData = {
    _id: chat._id,
    otherUser: otherUser,
    admin: chat.admin,
  };

  res.status(200).json({
    status: "success",
    message: "Successfully fetched messages",
    data: {
      messages: messages,
      chat: chatData,
    },
  });
});

const sendPrivateMessage = catchAsync(async (req, res, next) => {
  const senderId = req.user._id;
  const { chatId, content } = req.body;
  if (!mongoose.isValidObjectId(chatId)) {
    throw new AppError("Invalid chat Id", 400);
  }

  const chat = await Chat.findOne({ _id: chatId }).populate(
    "members",
    "username isOnline profilePic",
  );

  if (!chat) throw new AppError("Chat not found", 404);

  const isMember = chat.members.some((member) => member._id.toString() === senderId.toString());

  if (!isMember) {
    throw new AppError("You aren't member.", 403);
  }

  if (!content) {
    throw new AppError("No content available to be sent.", 400);
  }

  const createMsg = await Message.create({
    sender: senderId,
    content,
    chat: chatId,
  });

  const populatedMsg = await createMsg.populate("sender","username")

  const receiver = chat.members.find(
    (member) => member._id.toString() !== senderId.toString());

  if (receiver) {
    const receiverRoom = receiver._id.toString();
    const senderRoom = senderId.toString();
    // Emit to both rooms — receiver and sender both handled by the same socket listener
    getIO().to(receiverRoom).to(senderRoom).emit("newPrivateMessage", createMsg);
  }


  await Chat.findByIdAndUpdate(chatId, { lastMessage: createMsg._id });

  res.status(200).json({
    status: "success",
    message: "Successfully messaged created",
    data: populatedMsg,
  });

});

const getChats = catchAsync(async(req,res,next)=>{
  const userId = req.user._id;
  const populatedChats = await Chat.find({members:userId}).populate("members admin","username isOnline profilePic").populate("lastMessage","content sender");

  res.status(200).json({status:"success",message:"Succesfully fetched chats",data:populatedChats})
})

export { createChat, getPrviateMessages, sendPrivateMessage,getChats };
