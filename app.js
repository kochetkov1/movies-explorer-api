import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { constants } from 'http2';
import { errors } from 'celebrate';
import { userRouter } from './routes/userRouter.js';
import { moviesRouter } from './routes/moviesRouter.js';
import { createUser, login } from './controllers/user.js';
import { auth } from './middlewares/auth.js';
import { userBodyValidator, userLoginValidator } from './utils/validators.js';
import { errorMessages } from './utils/errorMessages.js';
import { NotFoundError } from './errors/NotFoundError.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';

const app = express();

const { PORT = 3011, DB_URL = 'mongodb://localhost:27017/moviesdb', NODE_ENV = 'development' } = process.env;
// const { PORT = 3011 } = process.env;

// Выбор ключа
const config = dotenv.config({ path: NODE_ENV === 'production' ? '.env' : '.env.common' }).parsed;

app.set('config', config);

mongoose.set({ runValidators: true });
mongoose.set('strictQuery', false);
mongoose.connect(DB_URL);
// mongoose.connect(config.DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(
  {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
));

// Логгер запросов
app.use(requestLogger);

// Вызов роутов авторизации и регистрации (доступны до авторизации)
app.post('/signup', userBodyValidator, createUser);
app.post('/signin', userLoginValidator, login);

// Все, что ниже - доступно только для авторизованных пользователей
app.use('/users', auth, userRouter);
app.use('/movies', auth, moviesRouter);

app.all('/*', auth, (req, res, next) => {
  next(new NotFoundError(errorMessages.incorrectRoute));
});

// Логгер ошибок
app.use(errorLogger);

// Ошибки celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use((err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || 'Неизвестная ошибка';
  res.status(status).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
