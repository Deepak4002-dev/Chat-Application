import express from 'express'
import {authenticate,authorize} from './../middlewares/auth.middleware.js'
import { createChat, createGroupChat, getChats, getGroupsChats, getPrivateChats, getPrviateMessages, sendPrivateMessage } from '../controllers/chat.controller.js'

const router = express.Router()

router.post("/create",authenticate,authorize("user"), createChat)
router.post("/create-message",authenticate,authorize("user"),sendPrivateMessage)
router.get("/all-chats",authenticate,authorize("user"),getChats)
router.get("/group-chats",authenticate,authorize("user"),getGroupsChats)
router.get("/private-chats",authenticate,authorize("user"),getPrivateChats)
router.post("/create-group",authenticate,authorize("user"),createGroupChat)
router.get("/:id",authenticate,authorize("user"),getPrviateMessages)

export default router