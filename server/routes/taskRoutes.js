const express = require('express');
const { Task, Statuses } = require('../models');
const { validateTask, validateTaskId } = require('../middlewares/validationMiddleware');
const errorMiddleware = require('../middlewares/errorMiddleware');

const router = express.Router();

router.post('/', validateTask, async (req, res, next) => {
  try {
    const { title, description, statusId } = req.body;

    const status = await Statuses.findByPk(statusId);
    if (!status) return res.status(400).json({ error: 'Status inválido' });

    const task = await Task.create({ title, description, statusId });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll({ include: Statuses });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateTaskId, validateTask, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, statusId } = req.body;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    if (statusId) {
      const status = await Statuses.findByPk(statusId);
      if (!status) return res.status(400).json({ error: 'Status inválido' });
    }

    await task.update({ title, description, statusId });
    res.json({ message: 'Tarefa atualizada com sucesso!', task });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    await task.destroy();
    res.json({ message: 'Tarefa excluída com sucesso!' });
  } catch (error) {
    next(error);
  }
});

router.use(errorMiddleware);

module.exports = router;
