import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 5000;

import authRoute from './routes/authRoute.js';
import projectRoute from './routes/projectRoute.js';
import taskRoute from './routes/taskRoute.js';
import subtaskRoute from './routes/subtaskRoute.js';
import userRoute from './routes/userRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import assignRoute from './routes/assignRoute.js';
import personalTaskRoute from './routes/personalTaskRoute.js';
import personalSubtaskRoute from './routes/personalSubtaskRoute.js';

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes
app.use('/pmapi/auth', authRoute);
app.use('/pmapi/project', projectRoute);
app.use('/pmapi/task', taskRoute);
app.use('/pmapi/subtask', subtaskRoute);
app.use('/pmapi/user', userRoute);   
app.use('/pmapi/employee', employeeRoute);
app.use('/pmapi/assign', assignRoute);
app.use('/pmapi/personaltask', personalTaskRoute);
app.use('/pmapi/personalsubtask', personalSubtaskRoute);

// Listen to port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});  