import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { getIO } from "../config/socket.js";
import User from "../models/User.js";

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
    const newChat = await Chat.create({
      isGroup: false,
      admin: userId,
      members: [userId, otherId],
    });
    chat = await newChat.populate("members", "username profilePic isOnline");
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

  // otherUser is only meaningful for private (2-person) chats
  const otherUser = chat.isGroup
    ? null
    : chat.members.find((member) => member._id.toString() !== userId.toString());

  const chatData = {
    _id: chat._id,
    otherUser: otherUser,   // null for groups — frontend uses chat.name instead
    admin: chat.admin,
    isGroup: chat.isGroup,
    name: chat.name,
    members: chat.members,
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

  const isMember = chat.members.some(
    (member) => member._id.toString() === senderId.toString(),
  );

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

  const populatedMsg = await createMsg.populate("sender", "username");

  if (chat.isGroup) {
    getIO().to(chat._id.toString()).emit("newGroupMessage", populatedMsg);
  } else {
    const receiver = chat.members.find(
      (member) => member._id.toString() !== senderId.toString(),
    );

    if (receiver) {
      const receiverRoom = receiver._id.toString();
      const senderRoom = senderId.toString();
      // Emit to both rooms — receiver and sender both handled by the same socket listener
      getIO()
        .to(receiverRoom)
        .to(senderRoom)
        .emit("newPrivateMessage", populatedMsg);
    }
  }

  await Chat.findByIdAndUpdate(chatId, { lastMessage: createMsg._id });

  res.status(200).json({
    status: "success",
    message: "Successfully messaged created",
    data: populatedMsg,
  });
});

const getChats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const populatedChats = await Chat.find({ members: userId })
    .populate("members admin", "username isOnline profilePic")
    .populate("lastMessage", "content sender");

  res.status(200).json({
    status: "success",
    message: "Succesfully fetched chats",
    data: populatedChats,
  });
});

const getPrivateChats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const populatedChats = await Chat.find({ members: userId, isGroup: false })
    .populate("members admin", "username isOnline profilePic")
    .populate("lastMessage", "content sender");

  res.status(200).json({
    status: "success",
    message: "Succesfully fetched chats",
    data: populatedChats,
  });
});

const getGroupsChats = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const populatedChats = await Chat.find({ members: userId, isGroup: true })
    .populate("members admin", "username isOnline profilePic")
    .populate("lastMessage", "content sender");

  res.status(200).json({
    status: "success",
    message: "Succesfully fetched chats",
    data: populatedChats,
  });
});

const createGroupChat = catchAsync(async (req, res, next) => {
  const { name, members } = req.body;
  const userId = req.user._id;

  if (!members || members?.length === 0) {
    throw new AppError("Members are required", 400);
  }

  for (let m of members) {
    if (!mongoose.isValidObjectId(m)) {
      throw new AppError("Invalid ID format", 400);
    }
  }

  const found = await User.find({_id:{$in:members}});
  if(found.length !== members.length)
  {
    throw new AppError("User not found", 404);
  }

  if (!name) {
    throw new AppError("Group name is required", 400);
  }

  if(!members.includes(userId.toString()))
  {
    members.push(userId)
  }

  const newGroupChat = await Chat.create({
    name,
    isGroup: true,
    admin: userId,
    members: members,
  });

  const populatedData = await newGroupChat.populate("members", "username profilePic isOnline");

  // Notify all online members' sockets to join the new group room immediately
  // so they receive messages without needing to reconnect
  const chatIdStr = newGroupChat._id.toString();
  members.forEach((memberId) => {
    const memberRoom = memberId.toString();
    // Get all sockets in that member's personal room and make them join the group room
    getIO().in(memberRoom).socketsJoin(chatIdStr);
  });

  res.status(200).json({
    status: "success",
    message: "Successfully group chat created",
    data: populatedData,
  });
});

export {
  createChat,
  getPrviateMessages,
  sendPrivateMessage,
  getChats,
  createGroupChat,
  getPrivateChats,
  getGroupsChats,
};
