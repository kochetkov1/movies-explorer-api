import { Movie } from '../models/movie.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ServerError } from '../errors/ServerError.js';
import { errorMessages } from '../utils/errorMessages.js';

export const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => next(new ServerError(err.message)));
};

export const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.movieBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};

export const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((document) => {
      if (document) {
        const movie = document.toObject();
        if (movie.owner.toString() === req.user._id) {
          document.remove();
          res.send(movie);
        } else next(new ForbiddenError(errorMessages.movieDeleteNotOwner));
      } else next(new NotFoundError(errorMessages.movieNotFound));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.movieBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};
