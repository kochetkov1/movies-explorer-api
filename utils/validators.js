import { celebrate, Joi } from 'celebrate';

const schemeObjectId = Joi.string().hex().length(24);
const schemeEmail = Joi.string().email();
const schemeUrl = Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/);

export const movieBodyValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: schemeUrl.required(),
    trailerLink: schemeUrl.required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: schemeUrl.required(),
    movieId: Joi.number().required(),
  }),
});

export const movieIdValidator = celebrate({
  params: Joi.object().keys({
    _id: schemeObjectId.required(),
  }),
});

export const userBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: schemeEmail.required(),
    password: Joi.string().required(),
  }),
});

export const userLoginValidator = celebrate({
  body: Joi.object().keys({
    email: schemeEmail.required(),
    password: Joi.string().required(),
  }),
});

export const userDescriptionValidator = celebrate({
  body: Joi.object().keys({
    email: schemeEmail.required(),
    name: Joi.string().min(2).max(30),
  }),
});
