import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { constants } from 'http2';
import { errors } from 'celebrate';
import { indexRouter } from './routes/index.js';
import { requestLogger, errorLogger } from './middlewares/logger.js';
import { errorMessages } from './utils/errorMessages.js';

const app = express();

const {
  PORT = 3011,
  DB_URL = 'mongodb://localhost:27017/moviesdb',
  NODE_ENV = 'development',
} = process.env;

// Выбор ключа
const config = dotenv.config({
  path: NODE_ENV === 'production' ? '.env' : '.env.common',
}).parsed;

app.set('config', config);
if (!config) {
  throw new Error('Config not found');
}

mongoose.set({ runValidators: true });
mongoose.set('strictQuery', false);
mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(rateLimit({
  message: { message: errorMessages.rateLimit },
  max: 100,
}));

// Логгер запросов
app.use(requestLogger);

// Подключаем все роуты
app.use(indexRouter);

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
