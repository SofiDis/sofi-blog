import { ErrorRequestHandler } from "express";

function errorMiddleware(): any {
  /**
   * Error handling Middleware function
   * for logging the error message
   */
  const logger: ErrorRequestHandler = (error, _req, _res, next) => {
    // Here I could implement better logging logic
    // and save it somewhere. (Elasticsearch??).
    console.log(`error ${error.message}`);

    next(error); // calling next middleware.
  };

  /**
   * Reads the error message and
   * sends back a response in JSON format
   */
  const responder: ErrorRequestHandler = (error, _req, res, _nxt) => {
    res.header("Content-Type", "application/json");

    const status = error.status || 400;

    res.status(status).send(error.message);
  };

  return { logger, responder };
}

export { errorMiddleware };
