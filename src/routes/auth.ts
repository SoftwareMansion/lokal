import errors from 'restify-errors';
import restify from 'restify';
import uuidv4 from 'uuid/v4';
import User from '../models/user';

export const authorizeUser = (req : restify.Request, res : restify.Response, next : restify.Next) => {
	const token = req.header('Token');
	User.findOne({token: token}, (err, user) => {
		if(err) {
			return next(new errors.InternalError(err));
		}
		if(!user || !token) {
			return next(new errors.UnauthorizedError());
		}
		next();
	})
}

export const loginHandler = (req : restify.Request, res : restify.Response, next : restify.Next) => {
  const {username, password} = req.body;
  User.findOne({ username: username }, function (err, user) {
    if (err) { 
      return next(new errors.InternalError(err)); 
    }
    if (!user) {
      return next(new errors.UnauthorizedError("no such user"));
    }
    if (user.password !== password) {
      return next(new errors.UnauthorizedError("bad password"));
    }
    const token = uuidv4();
    user.token = token;
    user.save();
    res.send(token);
    next();
  });
}

export const registerHandler = (req : restify.Request, res : restify.Response, next : restify.Next) => {
  if (!req.is('application/json')) {
    return next(
      new errors.InvalidContentError("Expects 'application/json'"),
    );
  }
  const data = req.body;
  const user = new User(data);
  user.save(err => {
    if (err) {
      console.error(err);
      return next(new errors.InternalError(err.message));
    }
    res.send(201);
    next();
  });
}