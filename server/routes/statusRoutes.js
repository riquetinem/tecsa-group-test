const express = require('express');
const { Statuses } = require('../models');
const errorMiddleware = require('../middlewares/errorMiddleware');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const statuses = await Statuses.findAll();
    res.json(statuses);
  } catch (error) {
    next(error);
  }
});

router.use(errorMiddleware);

module.exports = router;
