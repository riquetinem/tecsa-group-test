const { body, param, validationResult } = require('express-validator');

const validateTask = [
  body('title').optional().trim().isString().notEmpty().withMessage('O título deve ser uma string válida'),
  body('description').optional().trim().isString(),
  body('statusId').optional().isInt().withMessage('O statusId deve ser um número inteiro'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

const validateTaskId = [
  param('id').isInt().withMessage('O ID deve ser um número inteiro'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

module.exports = { validateTask, validateTaskId };
