import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {connectDB } from "./config/mongooseConfig.js";
import {swaggerDocs, swaggerUi} from "./config/swaggerConfig.js";
import { APIsRoute } from './routes/index.js';
import cors from 'cors';

const app = express();

// connect to db
app.use(express.json()); 
connectDB();

// view engine setup
app.set('views', path.join(process.cwd(), 'views')); // Sử dụng process.cwd() thay cho __dirname
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

// swagger config
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

app.use(cors({
  //origin: env.FRONT_END_URL,
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect route
app.use('/apis', APIsRoute);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
