# Task Manager API

## Descrição do Projeto
A aplicação **Task Manager** é uma API RESTful para gerenciar tarefas. Ela permite a criação, leitura, atualização e exclusão de tarefas, além de permitir a alteração do status de cada uma delas.

### Funcionalidades
- **POST /tasks**: Cria uma nova tarefa.
- **GET /tasks**: Retorna a lista de tarefas.
- **PUT /tasks/:id**: Atualiza uma tarefa existente.
- **DELETE /tasks/:id**: Exclui uma tarefa.
- Cada tarefa contém os seguintes campos:
  - `id`: Identificador único (gerado automaticamente).
  - `title`: Título da tarefa.
  - `description`: Descrição da tarefa.
  - `status`: Status da tarefa (pendente, em andamento, concluída).
  - `created_at`: Data de criação.
  - `updated_at`: Data de atualização.

## Tecnologias
- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL
- **Frontend**: React.js (opcional)
- **Docker**: Contêineres para orquestração dos serviços

---

## Como configurar e rodar o ambiente

### 1. Clonar o repositório

```bash
git clone https://github.com/riquetinem/tecsa-group-test.git
cd .\tecsa-group-test\
```

### 2. Instalar container 
```bash
## subir o container
docker-compose up -d
## derrubar o container
## docker-compose down
```

### 3. Rodar migrations
```bash
cd backend
cd task-manager
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
## desfazer migration
## npx sequelize-cli db:migrate:undo:all

```

Se precisar de mais algum ajuste ou adicionar algo específico, só avisar! 😄
