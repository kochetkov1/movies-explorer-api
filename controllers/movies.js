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
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessages.movieNotFound);
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(errorMessages.movieDeleteNotOwner);
      } else {
        return movie.remove();
      }
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError(errorMessages.movieBadRequest));
      } else {
        next(new ServerError(err.message));
      }
    });
};
