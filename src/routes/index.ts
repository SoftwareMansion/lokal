import errors from 'restify-errors';
import restify from 'restify';
import Todo from '../models/todo';
import { loginHandler, authorizeUser, registerHandler } from './auth.js';
import { assertJSON } from './utils';

export default function(server : restify.Server) {
	//server.post('/login', loginHandler);
	//server.post('/register', registerHandler);
	
	server.post('/todos',
		//authorizeUser,
		assertJSON,
		(req : restify.Request, res : restify.Response, next : restify.Next) => {
			let data = req.body || {};
			let todo = new Todo(data);
			todo.save(function(err) {
				if (err) {
					console.error(err);
					return next(new errors.InternalError(err.message));
				}
				res.send(201, todo);
				next();
			});
		}
	);

	server.get('/todos',
		//authorizeUser,
		(req, res, next) => {
			Todo.find({}, function(err, docs) {
				if (err) {
					return next(
						new errors.InvalidContentError(err.message),
					);
				}
				res.send(docs);
				next();
			});
		}
	);

	server.get('/todos/:todo_id',
		//authorizeUser,
		(req, res, next) => {
			Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {
				if (err) {
					return next(
						new errors.InvalidContentError(err.message),
					);
				}

				res.send(doc);
				next();
			});
		}
	);

	server.put('/todos/:todo_id',
		//authorizeUser,
		assertJSON,
		(req, res, next) => {
			let data = req.body || {};
			if (!data._id) {
				data = {...data, _id: req.params.todo_id};
			}
			Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {
				// debugger;
				if (err) {
					return next(
						new errors.InvalidContentError(err.message),
					);
				} else if (!doc) {
					return next(
						new errors.ResourceNotFoundError(
							'The resource you requested could not be found.',
						),
					);
				}

				Todo.findByIdAndUpdate(data._id, data, { new: true }, function(err, todo) {
					if (err) {
						return next(
							new errors.InvalidContentError(err.message),
						);
					}

					res.send(200, todo);
					next();
				});
			});
		}
	);

	server.del('/todos/:todo_id',
		//authorizeUser,
		(req, res, next) => {
			Todo.remove({ _id: req.params.todo_id }, function(err) {
				if (err) {
					return next(
						new errors.InvalidContentError(err.message),
					);
				}
				res.send(204);
				next();
			});
		}
	);
};