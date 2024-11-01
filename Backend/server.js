import dotenv from 'dotenv';
dotenv.config();  // Load environment variables here
import userRoutes from './routes/userRoute.js'
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import districtRoutes from './routes/districtRoute.js'
import dobRoutes from './routes/dobRoute.js'
import dodRoutes from './routes/dodRoutes.js'
// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // or '*', but be cautious with '*'
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log('GET request to /');
  res.send('Server is working');
});

app.use('/api/users', userRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/dob', dobRoutes)
app.use('/api/dod', dodRoutes)
// app.get('/', (req, res) => {
//   res.send('Hello, World! This is your server running .');
// });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
