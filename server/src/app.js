import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { openapiDocument } from './openapi.js';
import todoRoutes from './routes/todoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api-docs.json', (req, res) => {
  res.json(openapiDocument);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiDocument, { customSiteTitle: 'TODO API Docs' })
);

app.use('/api/todos', todoRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
