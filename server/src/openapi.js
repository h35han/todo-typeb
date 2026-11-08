import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const TodoSchema = registry.register(
  'Todo',
  z.object({
    _id: z.string().openapi({ example: '6aea5f242b66e0973a4cf03c' }),
    title: z.string().max(120).openapi({ example: 'Buy milk' }),
    description: z.string().max(1000).openapi({ example: 'Two litres' }),
    done: z.boolean().openapi({ example: false }),
    createdAt: z.string().openapi({
      format: 'date-time',
      example: '2026-11-03T22:24:36.733Z',
    }),
    updatedAt: z.string().openapi({
      format: 'date-time',
      example: '2026-11-03T22:24:36.733Z',
    }),
  })
);

const TodoInputSchema = registry.register(
  'TodoInput',
  z.object({
    title: z.string().min(1).max(120).openapi({ example: 'Buy milk' }),
    description: z.string().max(1000).optional().openapi({ example: 'Two litres' }),
  })
);

const TodoUpdateSchema = registry.register(
  'TodoUpdate',
  z
    .object({
      title: z.string().min(1).max(120).optional().openapi({ example: 'Buy oat milk' }),
      description: z.string().max(1000).optional().openapi({ example: 'One litre' }),
    })
    .openapi({ description: 'At least one of title or description must be provided.' })
);

const ErrorSchema = registry.register(
  'Error',
  z.object({
    message: z.string().openapi({ example: 'Todo not found' }),
  })
);

const HealthSchema = z.object({
  status: z.literal('ok'),
});

const todoIdParams = z.object({
  id: z.string().openapi({ example: '6aea5f242b66e0973a4cf03c' }),
});

function errorResponse(description, message) {
  return {
    description,
    content: {
      'application/json': {
        schema: ErrorSchema,
        example: { message },
      },
    },
  };
}

registry.registerPath({
  method: 'get',
  path: '/api/health',
  tags: ['Health'],
  operationId: 'healthCheck',
  summary: 'Check if the API is running',
  responses: {
    200: {
      description: 'API is running',
      content: {
        'application/json': {
          schema: HealthSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/todos',
  tags: ['Todos'],
  operationId: 'getTodos',
  summary: 'Get all todos',
  description: 'Returns todos sorted newest first.',
  responses: {
    200: {
      description: 'A list of todos',
      content: {
        'application/json': {
          schema: z.array(TodoSchema),
        },
      },
    },
    500: errorResponse('Unexpected server error', 'Something went wrong on the server'),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/todos',
  tags: ['Todos'],
  operationId: 'createTodo',
  summary: 'Create a todo',
  request: {
    body: {
      required: true,
      content: {
        'application/json': {
          schema: TodoInputSchema,
          example: {
            title: 'Buy milk',
            description: 'Two litres',
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Todo created',
      content: {
        'application/json': {
          schema: TodoSchema,
        },
      },
    },
    400: errorResponse('Invalid request', 'Title is required'),
    500: errorResponse('Unexpected server error', 'Something went wrong on the server'),
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/todos/{id}',
  tags: ['Todos'],
  operationId: 'updateTodo',
  summary: 'Update a todo',
  description: 'Updates the title and/or description. At least one field is required.',
  request: {
    params: todoIdParams,
    body: {
      required: true,
      content: {
        'application/json': {
          schema: TodoUpdateSchema,
          example: {
            title: 'Buy oat milk',
            description: 'One litre',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Todo updated',
      content: {
        'application/json': {
          schema: TodoSchema,
        },
      },
    },
    400: errorResponse('Invalid request', 'Title cannot be empty'),
    404: errorResponse('Todo not found', 'Todo not found'),
    500: errorResponse('Unexpected server error', 'Something went wrong on the server'),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/todos/{id}',
  tags: ['Todos'],
  operationId: 'deleteTodo',
  summary: 'Delete a todo',
  request: {
    params: todoIdParams,
  },
  responses: {
    204: {
      description: 'Todo deleted',
    },
    400: errorResponse('Invalid request', 'Invalid todo id'),
    404: errorResponse('Todo not found', 'Todo not found'),
    500: errorResponse('Unexpected server error', 'Something went wrong on the server'),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/todos/{id}/done',
  tags: ['Todos'],
  operationId: 'toggleTodo',
  summary: "Toggle a todo's done status",
  description: 'Flips the current done value. This endpoint does not take a request body.',
  request: {
    params: todoIdParams,
  },
  responses: {
    200: {
      description: 'Done status toggled',
      content: {
        'application/json': {
          schema: TodoSchema,
        },
      },
    },
    400: errorResponse('Invalid request', 'Invalid todo id'),
    404: errorResponse('Todo not found', 'Todo not found'),
    500: errorResponse('Unexpected server error', 'Something went wrong on the server'),
  },
});

export const openapiDocument = new OpenApiGeneratorV3(registry.definitions).generateDocument({
  openapi: '3.0.3',
  info: {
    title: 'TODO App API',
    version: '1.0.0',
    description: 'A small REST API for managing todos.',
  },
  servers: [
    {
      url: '/',
      description: 'Current server',
    },
  ],
  tags: [
    { name: 'Todos', description: 'Create and manage todos' },
    { name: 'Health', description: 'Service health' },
  ],
});
