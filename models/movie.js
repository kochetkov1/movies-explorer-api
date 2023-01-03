import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return /^https?:\/\/(www.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/.test(
            link,
          );
        },
        message: (props) => `${props.value} - некорректный URL`,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return /^https?:\/\/(www.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/.test(
            link,
          );
        },
        message: (props) => `${props.value} - некорректный URL`,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(link) {
          return /^https?:\/\/(www.)?[a-zA-Z0-9-]+\.[a-zA-Z0-9]+[\w-._~:/?#[\]@!$'()*+,;=]*#?/.test(
            link,
          );
        },
        message: (props) => `${props.value} - некорректный URL`,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export const Movie = mongoose.model('Movie', movieSchema);
