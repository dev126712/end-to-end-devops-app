import express from 'express';
import cors from 'cors';
import { readTodos, writeTodos } from './lib/todos.js';
import { Todo } from './types/todo.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/todos', async (req, res) => {
  const todos = await readTodos();
  res.json(todos);
});

app.post('/api/todos', async (req, res) => {
  const { title }: { title: string } = req.body;
  const todos = await readTodos();
  const newTodo: Todo = {
    id: Date.now().toString(),
    title,
    completed: false,
  };
  todos.push(newTodo);
  await writeTodos(todos);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed }: { title?: string; completed?: boolean } = req.body;
  const todos = await readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  if (title !== undefined) todos[index].title = title;
  if (completed !== undefined) todos[index].completed = completed;
  await writeTodos(todos);
  res.json(todos[index]);
});

app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const todos = await readTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  todos.splice(index, 1);
  await writeTodos(todos);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});