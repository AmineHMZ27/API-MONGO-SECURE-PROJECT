import { body, validationResult } from 'express-validator';

export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Need username'),
  body('password')
    .notEmpty()
    .withMessage('Need password'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  }
];

export const validateRegister = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('username too short')
    .notEmpty()
    .withMessage('Need username'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password too short')
    .notEmpty()
    .withMessage('Need password'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  }
];

export const validateAlbum = [
  body('title')
    .notEmpty()
    .withMessage('Need title')
    .isLength({ min: 2 })
    .withMessage('Title too short'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description too long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  }
];

export const validatePhoto = [
  body('title')
    .notEmpty()
    .withMessage('Need title')
    .isLength({ min: 2 })
    .withMessage('Title too short'),
  body('url')
    .notEmpty()
    .withMessage('Need url')
    .isURL()
    .withMessage('Wrong url'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description too long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  }
];
