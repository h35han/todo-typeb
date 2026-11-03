import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { after, before, beforeEach, describe, it, mock } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { Todo } from '../src/models/Todo.js';

process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK ??= 'false';

let mongo;

function findMongod() {
  if (process.env.MONGOMS_SYSTEM_BINARY) {
    return process.env.MONGOMS_SYSTEM_BINARY;
  }

  try {
    return execFileSync('which', ['mongod'], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}

before(async () => {
  const systemBinary = findMongod();
  mongo = await MongoMemoryServer.create(
    systemBinary ? { binary: { systemBinary } } : {}
  );

  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();

  if (mongo) {
    await mongo.stop();
  }
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

const api = request(app);

async function createTodo(overrides = {}) {
  const response = await api
    .post('/api/todos')
    .send({ title: 'Test todo', ...overrides });

  assert.equal(response.status, 201);
  return response.body;
}

describe('error handler', () => {
  it('passes the error to next when headers were already sent', () => {
    const error = new Error('late failure');
    const response = { headersSent: true };
    let forwarded;

    errorHandler(error, {}, response, (value) => {
      forwarded = value;
    });

    assert.equal(forwarded, error);
  });
});

describe('health', () => {
  it('returns ok', async () => {
    const response = await api.get('/api/health');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, { status: 'ok' });
  });
});

describe('GET /api/todos', () => {
  it('returns an empty list when there are no todos', async () => {
    const response = await api.get('/api/todos');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, []);
  });

  it('returns todos newest first', async () => {
    const older = await Todo.create({ title: 'Older todo' });
    const newer = await Todo.create({ title: 'Newer todo' });

    await Todo.collection.updateOne(
      { _id: older._id },
      { $set: { createdAt: new Date('2024-01-01') } }
    );
    await Todo.collection.updateOne(
      { _id: newer._id },
      { $set: { createdAt: new Date('2024-01-02') } }
    );

    const response = await api.get('/api/todos');

    assert.equal(response.status, 200);
    assert.deepEqual(
      response.body.map((todo) => todo.title),
      ['Newer todo', 'Older todo']
    );
  });

  it('returns 500 when the database query fails', async () => {
    mock.method(Todo, 'find', () => {
      throw new Error('database is down');
    });
    mock.method(console, 'error', () => {});

    try {
      const response = await api.get('/api/todos');

      assert.equal(response.status, 500);
      assert.deepEqual(response.body, {
        message: 'Something went wrong on the server',
      });
    } finally {
      mock.restoreAll();
    }
  });
});

describe('POST /api/todos', () => {
  it('creates a todo and trims its text', async () => {
    const response = await api.post('/api/todos').send({
      title: '  Buy milk  ',
      description: '  Two litres  ',
    });

    assert.equal(response.status, 201);
    assert.ok(response.body._id);
    assert.equal(response.body.title, 'Buy milk');
    assert.equal(response.body.description, 'Two litres');
    assert.equal(response.body.done, false);
    assert.ok(response.body.createdAt);
    assert.ok(response.body.updatedAt);
  });

  it('defaults the description to an empty string', async () => {
    const todo = await createTodo();

    assert.equal(todo.description, '');
  });

  it('rejects a missing title', async () => {
    const response = await api.post('/api/todos').send({ description: 'No title' });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title is required');
  });

  it('rejects a blank title', async () => {
    const response = await api.post('/api/todos').send({ title: '   ' });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title is required');
  });

  it('rejects a non-string title', async () => {
    const response = await api.post('/api/todos').send({ title: 123 });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title is required');
  });

  it('rejects a non-string description', async () => {
    const response = await api
      .post('/api/todos')
      .send({ title: 'Valid title', description: 123 });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Description must be a string');
  });

  it('rejects a title over 120 characters', async () => {
    const response = await api
      .post('/api/todos')
      .send({ title: 'x'.repeat(121) });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title must be 120 characters or fewer');
  });

  it('rejects a description over 1000 characters', async () => {
    const response = await api
      .post('/api/todos')
      .send({ title: 'Valid title', description: 'x'.repeat(1001) });

    assert.equal(response.status, 400);
    assert.equal(
      response.body.message,
      'Description must be 1000 characters or fewer'
    );
  });

  it('rejects a request with no body', async () => {
    const response = await api.post('/api/todos');

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title is required');
  });

  it('rejects malformed JSON', async () => {
    const response = await api
      .post('/api/todos')
      .set('Content-Type', 'application/json')
      .send('{"title":');

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Request body must be valid JSON');
  });
});

describe('PUT /api/todos/:id', () => {
  it('updates the title and description', async () => {
    const todo = await createTodo({ title: 'Old title', description: 'Old description' });

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'New title', description: 'New description' });

    assert.equal(response.status, 200);
    assert.equal(response.body.title, 'New title');
    assert.equal(response.body.description, 'New description');

    const saved = await Todo.findById(todo._id);
    assert.equal(saved.title, 'New title');
    assert.equal(saved.description, 'New description');
  });

  it('updates only the title when description is omitted', async () => {
    const todo = await createTodo({ description: 'Keep this description' });

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'New title' });

    assert.equal(response.status, 200);
    assert.equal(response.body.title, 'New title');
    assert.equal(response.body.description, 'Keep this description');
  });

  it('updates only the description when title is omitted', async () => {
    const todo = await createTodo({ title: 'Keep this title' });

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ description: 'New description' });

    assert.equal(response.status, 200);
    assert.equal(response.body.title, 'Keep this title');
    assert.equal(response.body.description, 'New description');
  });

  it('rejects an empty update', async () => {
    const todo = await createTodo();

    const response = await api.put(`/api/todos/${todo._id}`).send({});

    assert.equal(response.status, 400);
    assert.equal(
      response.body.message,
      'Provide a title or description to update'
    );
  });

  it('rejects an empty title', async () => {
    const todo = await createTodo();

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ title: '   ' });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title cannot be empty');
  });

  it('rejects a non-string description', async () => {
    const todo = await createTodo();

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ description: 123 });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Description must be a string');
  });

  it('rejects a title over 120 characters', async () => {
    const todo = await createTodo();

    const response = await api
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'x'.repeat(121) });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Title must be 120 characters or fewer');
  });

  it('returns 400 for an invalid id', async () => {
    const response = await api
      .put('/api/todos/not-an-id')
      .send({ title: 'New title' });

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Invalid todo id');
  });

  it('returns 404 for a todo that does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toString();

    const response = await api.put(`/api/todos/${id}`).send({ title: 'New title' });

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Todo not found');
  });
});

describe('PATCH /api/todos/:id/done', () => {
  it('toggles the done status', async () => {
    const todo = await createTodo();
    assert.equal(todo.done, false);

    const firstToggle = await api.patch(`/api/todos/${todo._id}/done`);
    assert.equal(firstToggle.status, 200);
    assert.equal(firstToggle.body.done, true);

    const secondToggle = await api.patch(`/api/todos/${todo._id}/done`);
    assert.equal(secondToggle.status, 200);
    assert.equal(secondToggle.body.done, false);
  });

  it('returns 400 for an invalid id', async () => {
    const response = await api.patch('/api/todos/not-an-id/done');

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Invalid todo id');
  });

  it('returns 404 for a todo that does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toString();

    const response = await api.patch(`/api/todos/${id}/done`);

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Todo not found');
  });
});

describe('DELETE /api/todos/:id', () => {
  it('deletes a todo', async () => {
    const todo = await createTodo();

    const response = await api.delete(`/api/todos/${todo._id}`);

    assert.equal(response.status, 204);
    assert.equal(await Todo.findById(todo._id), null);
  });

  it('returns 400 for an invalid id', async () => {
    const response = await api.delete('/api/todos/not-an-id');

    assert.equal(response.status, 400);
    assert.equal(response.body.message, 'Invalid todo id');
  });

  it('returns 404 for a todo that does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toString();

    const response = await api.delete(`/api/todos/${id}`);

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Todo not found');
  });
});

describe('unknown routes', () => {
  it('returns 404 for an unknown route', async () => {
    const response = await api.get('/api/unknown');

    assert.equal(response.status, 404);
    assert.equal(response.body.message, 'Route not found');
  });
});

describe('API documentation', () => {
  it('serves the generated OpenAPI document', async () => {
    const response = await api.get('/api-docs.json');

    assert.equal(response.status, 200);
    assert.equal(response.body.openapi, '3.0.3');
    assert.ok(response.body.paths['/api/todos/{id}/done']);
    assert.ok(response.body.components.schemas.Todo);
  });

  it('serves Swagger UI', async () => {
    const response = await api.get('/api-docs/');

    assert.equal(response.status, 200);
    assert.match(response.text, /TODO API Docs/);
  });
});
