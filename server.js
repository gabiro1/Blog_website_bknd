import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoute from './routes/auth_routes.js';
import postRoute from './routes/post_route.js';
import commentRoutes from './routes/comment_routes.js';

// app configuration
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
  
  res.send('Hello World!');

});





