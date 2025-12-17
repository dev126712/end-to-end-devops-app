'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/todos`);
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const res = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    if (res.ok) {
      setNewTitle('');
      fetchTodos();
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
    fetchTodos();
  };

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    await fetch(`http://localhost:5000/api/todos/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingId(null);
    fetchTodos();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Todo App</h1>
        <form onSubmit={addTodo} className="mb-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new todo"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded">
            Add Todo
          </button>
        </form>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id, todo.completed)}
                  className="mr-2"
                />
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 p-1 border border-gray-300 rounded"
                  />
                ) : (
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.title}
                  </span>
                )}
              </div>
              <div>
                {editingId === todo.id ? (
                  <>
                    <button onClick={saveEdit} className="text-green-500 mr-2">Save</button>
                    <button onClick={cancelEdit} className="text-gray-500">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(todo.id, todo.title)} className="text-blue-500 mr-2">Edit</button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-red-500">Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
