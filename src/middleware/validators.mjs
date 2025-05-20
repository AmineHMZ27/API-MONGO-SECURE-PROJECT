import { body, validationResult } from 'express-validator';

export const validateLogin = [
  body('username')
    .notEmpty()
    .withMessage('Le nom d’utilisateur est requis'),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
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
    .withMessage('Nom d’utilisateur trop court')
    .notEmpty()
    .withMessage('Nom d’utilisateur requis'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mot de passe trop court')
    .notEmpty()
    .withMessage('Mot de passe requis'),
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
    .withMessage('Le titre est requis')
    .isLength({ min: 2 })
    .withMessage('Titre trop court'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description trop longue'),
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
    .withMessage('Le titre est requis')
    .isLength({ min: 2 })
    .withMessage('Titre trop court'),
  body('url')
    .notEmpty()
    .withMessage('L’URL est requise')
    .isURL()
    .withMessage('L’URL n’est pas valide'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description trop longue'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    return next();
  }
];
