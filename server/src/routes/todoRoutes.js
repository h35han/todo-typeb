import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from '../controllers/todoController.js';

const router = Router();

router.route('/').get(getTodos).post(createTodo);
router.route('/:id').put(updateTodo).delete(deleteTodo);
router.patch('/:id/done', toggleTodo);

export default router;
