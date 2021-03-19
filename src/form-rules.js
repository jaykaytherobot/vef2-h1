import { body, query, param, validationResult } from 'express-validator';

export const serieRules = () => [
  body('name')
    .isLength({ min: 1 })
    .isLength({ max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('airDate')
    .isDate()
    .withMessage('airDate must be a date'),
  body('inProduction')
    .isBoolean()
    .withMessage('inProduction must be a boolean'),
  // body('image')
  //   .isLength({ min: 10 })
  //   .withMessage('image is required'),
  body('description')
    .isString()
    .withMessage('description must be a string'),
  body('language')
    .isString()
    .isLength(2),
];

export const seasonRules = () => [
  body('name')
    .isLength({ min: 1 })
    .isLength({ max: 128 })
    .withMessage('name is required, max 128 characters'),
  body('number')
    .isInt()
    .custom((value) => Number.parseInt(value, 10) >= 0),
  // body('image')
];

export const paginationRules = () => [
  query('offset')
    .if(query('offset').exists())
    .isInt()
    .withMessage('offset must be an integer')
    .bail()
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('offset must be a positive integer'),
  query('limit')
    .if(query('limit').exists())
    .isInt()
    .withMessage('limit must be an integer')
    .bail()
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('limit must be a positive integer')
];

// vonandi er hægt að senda inn streng idField sem að er nafnið á 
// param breytunni 
export const paramIdRules = (idField) => [
  param(idField)
    .isInt()
    .custom((value) => value > 0)
    .withMessage(`${idField} must be an integer larger than 0`)
]

export function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}