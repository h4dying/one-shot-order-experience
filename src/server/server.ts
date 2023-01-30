import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { authRelativeRoute, authRouter, userRelativeRoute, userRouter } from '../routes';
import { errorHandler, Logger } from '../shared';

/**
 * Adds set of middlewares only if the app runs on the production machine.
 * @param app The express application to add the set of production middleware to it.
 */

function setupProduction(app: Application): void {
  /** If the app runs on production machine */
  if (process.env.NODE_ENV === 'production') {
    /* Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help! */
    app.use(helmet());

    /* Gzip compressing can greatly decrease the size of the response body and hence increase the speed of a web app.
     * Use the compression middleware for gzip compression in your Express app.
     */
    app.use(compression());
  }
}

/**
 * Sets the http-request options for an express server.
 * @param app The express application to set its express server's request options.
 */
function setRequestOptions(app: Application): void {
  /**
   * Enable CORS to allow any javascript client to consume your server's api.
   */
  app.use(cors());

  /**
   * Allow parse incoming requests as JSON payloads.
   * The limit of request body size my be set using this option { limit: '5mb' }, default is 100kb.
   */
  app.use(express.json());

  /**
   * TODO: Setup localization.
   */
}

/**
 * Registers the routes for the express server.
 * @param app The express application to register its routes.
 * @returns void
 */
function registerRoutes(app: Application): void {
  /**
   * The base-route for the api.
   * @example http://localhost:3000/api/v1/
   * @example http://localhost:3000/api/v1/auth/login
   */
  const apiBaseRoute = '/api/v1/';

  /** Start register routes. */
  app.use(apiBaseRoute + authRelativeRoute, authRouter);
  app.use(apiBaseRoute + userRelativeRoute, userRouter);
}

/**
 * Setup the express server.
 * @param app The express application to setup the server.
 * @returns void
 */

export function setupServer(app: Application): void {
  /**
   * The order matters.
   * 1. Setup production middleware.
   * 2. Set request options.
   * 3. Register routes.
   * 4. Add the error-handler middleware at the very end of pipeline.
   */
  setupProduction(app);
  setRequestOptions(app);
  registerRoutes(app);
  /**  It's important to ensure that Express catches all errors that occur while running specially the async route handlers and middleware. */
  app.use(errorHandler);
}

/**
 * Starts an express server.
 * @param app The express application to start its express server.
 */
export function startServer(app: Application): void {
  const port = process.env.APP_PORT || 3000;

  app.listen(port, () => {
    Logger.info(`Express server is running on port ${port}, under the ${process.env.NODE_ENV} environment`, null, true);
  });
}
