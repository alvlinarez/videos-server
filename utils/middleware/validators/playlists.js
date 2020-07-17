const { check } = require('express-validator');

exports.playlistsValidator = [
  check('movieId')
    .not()
    .isEmpty()
    .withMessage('Movie is required.')
    .isMongoId()
    .withMessage('Wrong movie id')
];
