import { Router } from 'express';
import {
  getMovies,
  createMovie,
  deleteMovie,
} from '../controllers/movies.js';
import {
  movieIdValidator,
  movieBodyValidator,
} from '../utils/validators.js';

export const moviesRouter = Router();

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', movieBodyValidator, createMovie);
moviesRouter.delete('/movies/:_id', movieIdValidator, deleteMovie);
