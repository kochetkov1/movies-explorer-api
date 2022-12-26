import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ServerError } from '../errors/ServerError.js';
import { errorMessages } from '../utils/errorMessages.js';

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => next(new ServerError(err.message)));
};

export const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(errorMessages.userNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.userBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError(errorMessages.userNotFound));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.userBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.userBadRequest));
      } else if (err.code === 11000) {
        next(new ConflictError(errorMessages.userConflict));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const updateUser = (req, res, next) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.userBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};

// export const updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { avatar },
//     { new: true, runValidators: true },
//   )
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError(errorMessages.userBadRequest));
//       } else {
//         next(new ServerError(err.message));
//       }
//     });
// };

export const login = (req, res, next) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = req.app.get('config');
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'UnauthorizedError') {
        next(err);
      } else {
        next(new ServerError(err.message));
      }
    });
};
