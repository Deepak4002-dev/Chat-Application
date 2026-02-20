import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
connectDB();


{/* Routes */}
import authRoutes from './routes/auth.route.js';
const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
  methods:["GET","POST","PUT","PATCH","DELETE"]
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


app.use('/api/v1/auth',authRoutes);


app.use(errorHandler)


export default app;
