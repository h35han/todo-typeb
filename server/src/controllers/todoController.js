import { Todo } from '../models/Todo.js';

function isValidTitle(value) {
  return typeof value === 'string' && value.trim() !== '';
}

export async function getTodos(req, res) {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
}

export async function createTodo(req, res) {
  const { title, description } = req.body ?? {};

  if (!isValidTitle(title)) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'Description must be a string' });
  }

  const todo = await Todo.create({ title, description });
  res.status(201).json(todo);
}

export async function updateTodo(req, res) {
  const { title, description } = req.body ?? {};
  const updates = {};

  if (title !== undefined) {
    if (!isValidTitle(title)) {
      return res.status(400).json({ message: 'Title cannot be empty' });
    }
    updates.title = title;
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string' });
    }
    updates.description = description;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'Provide a title or description to update' });
  }

  const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
}

export async function toggleTodo(req, res) {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todo.done = !todo.done;
  await todo.save();

  res.json(todo);
}

export async function deleteTodo(req, res) {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send();
}
