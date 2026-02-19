import express from 'express'
import {login, signup} from '../controllers/auth.controller.js'
import {validator} from '../middlewares/validator.middleware.js'
import signupSchema, { loginSchema } from '../utils/authValidators.js';
const router = express.Router();

router.post('/signup',validator(signupSchema,'body'),signup)
router.post('/login',validator(loginSchema,'body'),login)
router.post('/refresh', refresh);       // No auth needed - uses refresh token cookie
router.post('/logout', authenticate, logout); // Must be logged in to logout

export default router;