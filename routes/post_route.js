import express from 'express';
import { createPost, getPosts, getPostById, editPost, deletePost } from '../controllers/post_controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';


const postRoute = express.Router();
postRoute.post('/post', upload.single('image'), createPost);
postRoute.get('/posts', getPosts);
postRoute.get('/post/:id', getPostById);
postRoute.put('/edit/:id', authMiddleware, upload.single("image"), editPost);
postRoute.delete('/delete/:id', authMiddleware, deletePost);


export default postRoute;