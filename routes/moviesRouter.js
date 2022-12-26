import { Router } from 'express';
import {
  getMovies,
  createMovie,
  deleteMovie,
  // addLikeCard,
  // deleteLikeCard,
} from '../controllers/movies.js';
import {
  movieIdValidator,
  movieBodyValidator,
} from '../utils/validators.js';

export const moviesRouter = Router();

moviesRouter.get('/', getMovies);
moviesRouter.post('/', movieBodyValidator, createMovie);
moviesRouter.delete('/_id', movieIdValidator, deleteMovie);
// moviesRouter.put('/:cardId/likes', cardIdValidator, addLikeCard);
// moviesRouter.delete('/:cardId/likes', cardIdValidator, deleteLikeCard);

// check
