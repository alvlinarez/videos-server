const { check } = require('express-validator');

exports.ratingsValidator = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ max: 5 })
    .withMessage('Name is required.')
];
