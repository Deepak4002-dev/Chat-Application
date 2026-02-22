import express from 'express'
import {authenticate,authorize} from './../middlewares/auth.middleware.js'
import {getAllFriends, getFriends} from './../controllers/friend.controller.js'

const router = express.Router()


router.get('/',authenticate,authorize("user"), getFriends);
router.get('/all',authenticate,authorize("user"),getAllFriends)
router.post('/request',authenticate, authorize("user"))
router.post('/accept',authenticate, authorize("user"))
router.post('/reject',authenticate, authorize("user"))
router.get('/request-notification',authenticate, authorize("user"));


export default router