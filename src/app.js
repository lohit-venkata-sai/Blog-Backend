import express from 'express'
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware.js';

import CookieParser from 'cookie-parser';

import healthCheckRoute from './routes/healthCheck.route.js';
import userRoute from './routes/users.routes.js';
import blogRoute from './routes/blogs.routes.js';
import likesRouter from './routes/likes.routes.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(CookieParser());
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
    limit: '16kb',
}))



//routes
app.use('/api/v1/healthcheck', healthCheckRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/blogs', blogRoute);
app.use('/app/v1/likes', likesRouter);


//errorHandler
app.use(errorHandler);
export { app }