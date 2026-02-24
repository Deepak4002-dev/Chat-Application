import express from 'express'
import {authenticate,authorize} from './../middlewares/auth.middleware.js'
import { createChat, getPrviateMessages } from '../controllers/chat.controller.js'

const router = express.Router()

router.get('/:id',authenticate,authorize("user"),getPrviateMessages)
router.post('/create',authenticate,authorize("user"), createChat)


export default router