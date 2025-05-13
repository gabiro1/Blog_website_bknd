import express from 'express';
import { register, login, editUser } from '../controllers/auth_controller.js';

const userRoute = express.Router();
userRoute.post('/register', register);
userRoute.post('/login', login);
userRoute.put('/edit/:userId', editUser);


export default userRoute;