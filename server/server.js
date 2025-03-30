require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Task, Status } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware de log para todas as requisições
app.use((req, res, next) => {
  console.log(`Recebida ${req.method} em ${req.url} com body:`, req.body);
  next();
});

// Tasks
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, statusId } = req.body;

    const status = await Status.findByPk(statusId);
    if (!status) return res.status(400).json({ error: "Status inválido" });

    const task = await Task.create({ title, description, statusId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll({ include: Status });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, statusId } = req.body;

    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });

    if (statusId) {
      const status = await Status.findByPk(statusId);
      if (!status) return res.status(400).json({ error: "Status inválido" });
    }

    await task.update({ title, description, statusId });
    res.json({ message: 'Tarefa atualizada com sucesso!', task });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    await task.destroy();
    console.log('Tarefa excluída:', task);
    res.json({ message: 'Tarefa excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Status
app.get('/status', async (req, res) => {
  try {
    const status = await Status.findAll();
    console.log('Enviando status:', status);
    res.json(status);
  } catch (error) {
    console.error('Erro ao buscar os status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});