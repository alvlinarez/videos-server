const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
  const { originals, mostWatched } = req.query;
  try {
    let movies = [];
    if (originals) {
      movies = await Movie.find({ original: true });
      return res.json(movies);
    }
    if (mostWatched) {
      movies = await Movie.find().sort({ timesWatched: -1 }).limit(7);
      return res.json(movies);
    }
    movies = await Movie.find();
    return res.json(movies);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.getMovieById = async (req, res) => {
  const movieId = req.params.id;
  if (!movieId) {
    return res.status(400).json({
      error: 'movieId not found'
    });
  }
  const movie = await Movie.findOneAndUpdate(
    { _id: movieId },
    { $inc: { timesWatched: 1 } },
    { new: true }
  );
  if (!movie) {
    return res.status(400).json({
      error: 'Movie not found'
    });
  }
  return res.json(movie);
};

exports.createMovie = async (req, res) => {
  try {
    const { title, year, cover, description, duration, source } = req.body;
    let movie = await Movie.findOne({ title });
    if (movie) {
      return res.status(400).json({
        error: 'Movie with that name already exists'
      });
    }
    movie = new Movie({
      title,
      year,
      cover,
      description,
      duration,
      source,
      contentRating: '5f0f760a9b9b9b3984dbc728',
      tags: ['5f0f25da2b1a3623e4840578', '5f0f25b22b1a3623e4840577']
    });
    movie = await movie.save();
    return res.json(movie);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};
