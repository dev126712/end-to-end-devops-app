import fs from 'fs/promises';
import path from 'path';
import { Todo } from '../types/todo.js';

const filePath = path.join(process.cwd(), 'todos.json');

export async function readTodos(): Promise<Todo[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writeTodos(todos: Todo[]) {
  await fs.writeFile(filePath, JSON.stringify(todos, null, 2));
}
