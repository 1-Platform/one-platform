import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import fs from 'fs';
import { GraphQLServer } from 'graphql-yoga';
import logger from 'morgan';
import methodOverride from 'method-override';
import { mergeSchemas } from 'graphql-tools';
<% if (dbSupport) { -%>
import mongoose from 'mongoose';
<% } -%>  

import gqlSchema from './src/typedef.graphql';
import { <%= resolverName %> as resolver } from './src/resolver';

const enablePlayground = process.env.NODE_ENV !== 'production';
const graphqlOptions: any = {
  port: process.env.PORT || 8080, // Please make sure to change the port if you are running multiple api servers at a time
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  tracing: false,
};
if (enablePlayground) {
  graphqlOptions.playground = '/playground';
}

if (process.env.NODE_ENV !== 'test') {
  graphqlOptions.https = {
    cert: fs.readFileSync('/etc/pki/tls/certs/server.crt'),
    key: fs.readFileSync('/etc/pki/tls/private/server.key')
  };
}

/**
 * The <%= serviceClassName %>
 *
 * @class <%= serviceClassName %>
 */
export class <%= serviceClassName %> {

  /**
   * The express application.
   * @type {Application}
   */
  public app: any;
  /**
   * Bootstrap the application.
   *
   * @class <%= serviceClassName %>
   * @method bootstrap
   * @static
   */
  public static bootstrap(): <%= serviceClassName %> {
    return new <%= serviceClassName %>();
  }

  /**
   * Constructor.
   *
   * @class <%= serviceClassName %>
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = new GraphQLServer({
      schema: mergeSchemas({
                schemas: [
                  gqlSchema,
                ],
                resolvers: [
                  resolver,
                ]
              })
    });
    // configure application
    this.middleware();

    // add routes
    this.routes();

  }

  /**
   * Configure application
   *
   * @class <%= serviceClassName %>
   * @method config
   */
  public middleware() {
<% if (dbSupport) { -%>
    /* Configuring Mongoose */
    mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);

    /* Establishing mongodb connection */
    const dbCredentials = (process.env.DB_USER && process.env.DB_PASSWORD)
      ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
      : '';
    const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;

    mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true }).catch(console.error);

    mongoose.connection.on('error', error => {
      console.error(error);
    });
<% } -%>

    // morgan middleware to log HTTP requests
    this.app.use(logger('":method :url :status :res[content-length] - :response-time ms :referrer :user-agent"'));

    // use json form parser middleware
    this.app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: 'application/json' }));

    // use query string parser middleware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //  catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    // Mount cookie parker
    this.app.use(cookieParser(process.env.NODE_ENV));

    // Mount override
    this.app.use(methodOverride());

    // Error handling
    this.app.use(errorHandler());

  }

  /**
   * Create Graphql API base route
   *
   * @class <%= serviceClassName %>
   * @method routes
   */
  public routes() {

    const router = express.Router();
    // configure CORS
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
      credentials: true,
      methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
      origin: '*',
      preflightContinue: false
    };
    router.use(cors(corsOptions));

    // root request
    router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.json({ message: 'One Platform <%= serviceClassName %> microservice APIs.' });
      next();
    });

    // enable CORS pre-flight
    router.options('*', cors(corsOptions));
  }
}

export default <%= serviceClassName %>.bootstrap().app.start(graphqlOptions);
