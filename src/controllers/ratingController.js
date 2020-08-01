const Rating = require('../models/Rating');

exports.getRatings = async (req, res) => {
  try {
    const ratings = await Rating.find();
    return res.json(ratings);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        error: 'Params not found'
      });
    }
    const idRating = req.params.id;
    const rating = await Rating.findById(idRating);
    if (!rating) {
      return res.status(400).json({
        error: 'Rating not found'
      });
    }
    return res.json(rating);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};

exports.createRating = async (req, res) => {
  try {
    const { name } = req.body;
    let rating = await Rating.findOne({ name });
    if (rating) {
      return res.status(400).json({
        error: 'Rating with that name already exists'
      });
    }
    rating = new Rating({ name });
    rating = await rating.save();
    return res.json(rating);
  } catch (e) {
    return res.status(400).json({
      error: e.message
    });
  }
};
