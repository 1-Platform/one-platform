import {Router, Request, Response, NextFunction} from 'express';
import { request } from 'http';

/**
 * @class <%= apiName %>
 */

class <%= apiName %> {
  private static instance: <%= apiName %>;
  router: Router = Router();

  public static getInstance() {
    if (!<%= apiName %>.instance) {
      <%= apiName %>.instance = new <%= apiName %>();
    }
    return <%= apiName %>.instance;
  }

  /**
   * Initializing Constructor
  */
  constructor() {
    // Binding the functions on class instance for all APIs
    this.router.get('/', this.list.bind(this));
    this.router.get('/id/:id', this.get.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.put('/id/:id', this.update.bind(this));
    this.router.patch('/id/:id', this.patch.bind(this));
    this.router.delete('/id/:id', this.delete.bind(this));
  }

  public list(req: Request, res: Response, next: NextFunction) {
    res.json([{
      'message': 'GET API for <%= serviceClassName %> microservice',
    }]);
    next();
    return;
  }

  public get(req: Request, res: Response, next: NextFunction) {
    res.json({
      'message': 'GET by ID API for <%= serviceClassName %> microservice',
    });
    next();
    return;
  }

  public create(req: Request, res: Response, next: NextFunction) {
    res.json({
      'apiMessage': 'POST API for <%= serviceClassName %> microservice',
      'message': req.body.message
    });
    next();
    return;
  }

  public update(req: Request, res: Response, next: NextFunction) {
    res.json({
      'apiMessage': 'PUT API for <%= serviceClassName %> microservice',
      'message': req.body.message
    });
    next();
    return;
  }

  public patch(req: Request, res: Response, next: NextFunction) {
    res.json({
      'apiMessage': 'PATCH API for <%= serviceClassName %> microservice',
      'message': req.body.message
    });
    next();
    return;
  }

  public delete(req: Request, res: Response, next: NextFunction) {
    res.json({
      'apiMessage': 'DELETE API for <%= serviceClassName %> microservice',
      'message': req.body.message
    });
    next();
    return;
  }
}

export default <%= apiName %>.getInstance().router;

