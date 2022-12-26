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
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
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
  Movie.findById(req.params.movieId)
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

// export const addLikeCard = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true, runValidators: true },
//   )
//     .then((card) => {
//       if (card) {
//         res.send(card);
//       } else {
//         next(new NotFoundError(errorMessages.cardNotFound));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError(errorMessages.cardBadRequest));
//       } else {
//         next(new ServerError(err.message));
//       }
//     });
// };

// export const deleteLikeCard = (req, res, next) => {
//   Movie.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true, runValidators: true },
//   )
//     .then((card) => {
//       if (card) {
//         res.send(card);
//       } else {
//         next(new NotFoundError(errorMessages.cardNotFound));
//       }
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError(errorMessages.cardBadRequest));
//       } else {
//         next(new ServerError(err.message));
//       }
//     });
// };
