import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import MySQLSessionStore from 'express-mysql-session';
import routes from './app/main';
import config from './config';
import { logger } from './libs/logger';
import { initializePassport } from './libs/auth';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
if (process.env.NODE_REQUEST_LOG) {
  app.use(
    morgan('dev', {
      stream: {
        write: (str: string) => {
          logger.info(str);
        },
      },
    }),
  );
}

app.use(express.json({ limit: '1MB' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Authentication
const dbDetails = config.dbDetails;
const sessionStore = new MySQLSessionStore({
  host: dbDetails.host,
  port: dbDetails.port,
  user: dbDetails.user,
  password: dbDetails.password,
  database: dbDetails.database,
  schema: config.sessionsSchema,
});

app.use(
  session({
    secret: 'ThisisAnINterestingsecret',
    saveUninitialized: false,
    resave: false,
    store: sessionStore as any,
  }),
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

routes(app);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500);
    logger.error('500 error', {
      message: err.message,
      error: err,
      title: 'error',
    });

    res.json({
      message: err.message,
      error: err,
      title: 'error',
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  logger.error('500 error', {
    message: err.message,
    error: err,
    title: 'error',
  });
});

export default app;
