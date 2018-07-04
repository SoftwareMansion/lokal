import errors from 'restify-errors';
import restify from 'restify';

export const assertJSON = (req : restify.Request, res : restify.Response, next : restify.Next) => {
  if (!req.is('application/json')) {
    return next(
      new errors.InvalidContentError("Expects 'application/json'"),
    );
  }
  next();
}