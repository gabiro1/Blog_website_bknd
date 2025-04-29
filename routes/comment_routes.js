import express from 'express';
import { createComment, getComments, getCommentById, editComment, deleteComment } from '../controllers/comment_controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const commentRoutes = express.Router();
commentRoutes.post('/posts/:id/comments', authMiddleware, createComment);
commentRoutes.get('/posts/:id/comments', getComments);
commentRoutes.get('/comments/:id', getCommentById);
commentRoutes.put('/comments/:id', authMiddleware, editComment);
commentRoutes.delete('/comments/:id', authMiddleware, deleteComment);

export default commentRoutes;
