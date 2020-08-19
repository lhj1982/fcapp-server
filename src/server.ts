import * as dotenv from 'dotenv';
import { Model, model } from 'mongoose';
// import * as path from 'path';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as xmlparser from 'express-xml-bodyparser';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import * as swaggerUi from 'swagger-ui-express';
import cacheMiddleware from './middleware/cache.middleware';
import logger from './middleware/logger.middleware';
import errorMiddleware from './middleware/error.middleare';
import config from './config';
import { RegisterRoutes } from './routes';
// import * as fs from 'fs';

// Set env values
dotenv.config();
const compression = require('compression');

// Connect to MongoDB
(mongoose as any).Promise = bluebird;
mongoose.connect(`${config.dbUri}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  replicaSet: 'rs0',
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: false,
  poolSize: 10,
  connectTimeoutMS: 45000
});

// mongoose.connection.on('error', () => {
//   throw new Error(`unable to connect to database: ${process.env.DB_NAME}`);
// });

mongoose.connection.on('connected', () => {
  logger.info('Connection Established');
});

mongoose.connection.on('reconnected', () => {
  logger.warn('Connection Reestablished');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Connection Disconnected');
});

mongoose.connection.on('close', () => {
  logger.warn('Connection Closed');
});

mongoose.connection.on('error', error => {
  logger.error('ERROR: ' + error);
});

// Configure Rate Limiter
const { RateLimiterMongo } = require('rate-limiter-flexible');
const rateLimiterMongo = new RateLimiterMongo({
  storeClient: mongoose.connection,
  points: 4,
  duration: 1
}); // 4 request in 1 second per ip address
const rateLimiter = (req: any, res: any, next: any): any => {
  rateLimiterMongo
    .consume(req.ip)
    .then(() => next())
    .catch(() => res.status(429).send('Whoa! Slow down there little buddy'));
};

// Configure CORS
/*
(origin: any, callback: any) => {
    logger.info(`origin: ${origin}`);
    if (!origin || (config.server.cors.whitelist && config.server.cors.whitelist.indexOf(origin) !== -1)) {
      callback(null, true);
    } else {
      callback('Not allowed by CORS');
    }
  }
 */
const corsOptions = {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'Credentials', 'X-Requested-With', 'Accept'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Configure App
const app = express();

// app.use(rateLimiter);
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(xmlparser());
app.use((req, res, next) => {
  logger.info(`Request from: ${req.originalUrl}`);
  logger.info(`Request type: ${req.method}`);
  next();
});
app.get('/', function(req, res) {
  res.send('jubenfan api v1.0.0');
});
app.get('/healthcheck', function(req, res) {
  res.send('OK');
});
app.use(compression());

app.use(cacheMiddleware(config.cache.duration));

const http = require('http').Server(app);

// Start Server
// const port = config.server.port;
http.listen(config.server.port, () => {
  console.log(`listening on ${config.server.port}`);
});

// Start Swagger Docs
RegisterRoutes(app);
app.use(errorMiddleware);
try {
  const swaggerDocument = require('../swagger.json');
  swaggerDocument.host = config.server.entrypoint;
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.log('Unable to load swagger.json', err);
}

export = app;
