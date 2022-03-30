import express from 'express';
import createError from 'http-errors';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import registerRouter from './routes/auth/register.js';
import tokenRouter from './routes/auth/token.js';
import userInfoRouter from './routes/auth/userInfo.js';
import revokeRouter from './routes/auth/revoke.js';

import { checkAdminUser } from './services/user.js';

import conneectDatabase from './configurations/mongodb.js';
import winstonLogger from './configurations/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', registerRouter);
app.use('/auth', tokenRouter);
app.use('/auth', userInfoRouter);
app.use('/auth', revokeRouter);
app.use('/users', usersRouter);

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Auth Server',
    version: '1.0.0',
  },
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ['./routes*.js', './routes/**/*.js'],
};

const openapiSpecification = swaggerJSDoc(swaggerOptions);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(openapiSpecification);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.on('auth-server:initialized', async () => {
  winstonLogger.info('verifying if admin user exists');

  await conneectDatabase();
  await checkAdminUser();
});

export default app;
