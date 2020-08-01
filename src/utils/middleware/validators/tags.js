const { check } = require('express-validator');

exports.tagsValidator = [
  check('name')
    .not()
    .isEmpty()
    .isLength({ max: 32 })
    .withMessage('Name is required.')
];
