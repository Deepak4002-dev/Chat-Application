import express from 'express'
import {authenticate,authorize} from './../middlewares/auth.middleware.js'
import {accept, cancel, getAllUsers, getFriends, notifyRequest, reject, request} from './../controllers/friend.controller.js'

const router = express.Router()


router.get('/',authenticate,authorize("user"), getFriends);
router.get('/all',authenticate,authorize("user"),getAllUsers)
router.post('/request',authenticate, authorize("user"),request)
router.get('/request-notification',authenticate, authorize("user"),notifyRequest);
router.post('/accept/:id',authenticate, authorize("user"),accept)
router.delete('/reject/:id',authenticate, authorize("user"),reject)
router.delete('/cancel/:id',authenticate,authorize("user"),cancel);

export default router