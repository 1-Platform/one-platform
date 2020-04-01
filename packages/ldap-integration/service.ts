import * as fs from 'fs';
import * as https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import logger from 'morgan';
import methodOverride from 'method-override';

import LdapAPIRouter from './src/api';

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY || ''),
  cert: fs.readFileSync(process.env.SSL_CERT || '')
};

const { port = 8080 } = { port : process.env.PORT };

/**
 * The Ldap
 *
 * @class Ldap
 */
export class Ldap {

  /**
   * The express application.
   * @type {Application}
   */
  public app: any;
  public server: any;
  /**
   * Bootstrap the application.
   *
   * @class Ldap
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Ldap {
    return new Ldap();
  }

  /**
   * Constructor.
   *
   * @class Ldap
   * @constructor
   */
  constructor() {
    // configure expressjs application
    this.middleware();

    // add routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Ldap
   * @method middleware
   */
  public middleware() {
    this.app = express();

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

    // Mount cookie parser
    this.app.use(cookieParser(process.env.COOKIE_PARSER));

    // Mount override
    this.app.use(methodOverride());

    // Error handling
    this.app.use(errorHandler());

    this.app.set('port', port);

    this.server = https.createServer(httpsOptions, this.app);

    /**
     * Listen on provided port, on all network interfaces.
     */
    this.server.listen(port, () => {
      console.log(`Server listening on ${port}`);
    });
  }

  /**
   * Create REST API routes
   *
   * @class Ldap
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

    // create API routes
    this.app.use('/', LdapAPIRouter);

    // enable CORS pre-flight
    router.options('*', cors(corsOptions));
  }
}

export default Ldap.bootstrap().app;


