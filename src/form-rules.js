import {
  body, query, param, validationResult,
} from 'express-validator';
import { getSerieById } from './db.js';

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

export const patchSerieRules = () => [
  body()
    .custom((value, { req }) => req.body.name
      || req.body.airDate
      || req.body.inProduction
      || req.body.description
      || req.body.language
      || req.body.tagline
      || req.body.network
      || req.body.url)
    .withMessage('require at least one value of: name, airDate, inProduction, tagline, image, description, language, network, url'),
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
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('offset must be a positive integer')
    .isInt()
    .withMessage('offset must be an integer'),
  query('limit')
    .if(query('limit').exists())
    .custom((value) => Number.parseInt(value, 10) >= 0)
    .withMessage('limit must be a positive integer')
    .isInt()
    .withMessage('limit must be an integer'),
];

export const ratingRules = () => [
  body('grade')
    .isInt()
    .withMessage('Grade must be an integer greater than or equal to 0 and less than or equal to 5')
    .bail()
    .custom((value) => Number.parseInt(value, 10) <= 5 && Number.parseInt(value, 10) >= 0)
    .withMessage('Grade must be an integer greater than or equal to 0 and less than or equal to 5'),
];

export const statusRules = () => [
  body('status')
    .isInt()
    .withMessage('Status must be an integer greater than or equal to 0 and less than or equal to 2')
    .bail()
    .custom((value) => Number.parseInt(value, 10) <= 2 && Number.parseInt(value, 10) >= 0)
    .withMessage('Status must be an integer greater than or equal to 0 and less than or equal to 2'),
];

// vonandi er hægt að senda inn streng idField sem að er nafnið á
// param breytunni
export const paramIdRules = (idField) => [
  param(idField)
    .isInt()
    .custom((value) => value > 0)
    .withMessage(`${idField} must be an integer larger than 0`),
];

export async function serieExists(req, res, next) {
  const serie = await getSerieById(req.params.serieId);
  if (!serie) {
    return res.status(404).json({
      errors: [{
        param: 'id',
        msg: 'Could not find serie with this id',
        location: 'params',
      }],
    });
  }
  next();
}

export function checkValidationResult(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
