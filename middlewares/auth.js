import jwt from 'jsonwebtoken';

import { errorMessages } from '../utils/errorMessages.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError(errorMessages.needAuthorize));
  }

  const token = authorization.replace(/^Bearer\s/i, '');
  let payload;

  try {
    const { JWT_SECRET } = req.app.get('config');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Ошибка авторизации:', err.message));
  }
  req.user = payload;
  return next();
};
