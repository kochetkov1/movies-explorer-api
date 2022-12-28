import { Router } from 'express';
import {
  getCurrentUser,
  updateUser,
} from '../controllers/user.js';
import {
  userDescriptionValidator,
} from '../utils/validators.js';

export const userRouter = Router();

userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/me', userDescriptionValidator, updateUser);
