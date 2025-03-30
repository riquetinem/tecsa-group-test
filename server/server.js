require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const statusRoutes = require('./routes/statusRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use('/api/tasks', taskRoutes);
app.use('/api/status', statusRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
