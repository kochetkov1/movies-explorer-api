import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { userRouter } from './userRouter.js';
import { moviesRouter } from './moviesRouter.js';
import { userBodyValidator, userLoginValidator } from '../utils/validators.js';
import { createUser, login } from '../controllers/user.js';
import { errorMessages } from '../utils/errorMessages.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export const indexRouter = Router();

// Вызов роутов авторизации и регистрации (доступны до авторизации)
indexRouter.post('/signup', userBodyValidator, createUser);
indexRouter.post('/signin', userLoginValidator, login);

// Все, что ниже - доступно только для авторизованных пользователей
indexRouter.use('/', auth, userRouter);
indexRouter.use('/', auth, moviesRouter);

indexRouter.all('/*', auth, (req, res, next) => {
  next(new NotFoundError(errorMessages.incorrectRoute));
});
