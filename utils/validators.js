import { celebrate, Joi } from 'celebrate';

// убрать лишнее, написать новое

const schemeObjectId = Joi.string().alphanum().hex().length(24);
const schemeEmail = Joi.string().email();
const schemeUrl = Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/);

export const movieBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: schemeUrl.required(),
  }),
});

export const movieIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: schemeObjectId.required(),
  }),
});

export const userBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: schemeUrl,
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
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});
