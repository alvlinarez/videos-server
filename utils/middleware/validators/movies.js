const { check } = require('express-validator');

exports.moviesValidator = [
  check('title')
    .not()
    .isEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 80 })
    .withMessage('Title is too long'),
  check('year')
    .not()
    .isEmpty()
    .withMessage('Year is required.')
    .isNumeric()
    .withMessage('Year is not numeric')
    .custom(function (value) {
      return value > 1888 && value < 2077;
    })
    .withMessage('Year must be between 1888 and 2077'),
  check('cover').not().isEmpty().withMessage('Cover is required.'),
  check('description')
    .not()
    .isEmpty()
    .withMessage('Description is required.')
    .isLength({ max: 300 })
    .withMessage('Description is too long'),
  check('duration')
    .not()
    .isEmpty()
    .withMessage('Duration is required.')
    .isNumeric()
    .withMessage('Duration must be numeric'),
  check('source').not().isEmpty().withMessage('Source is required.')
];
