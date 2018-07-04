import restify from 'restify';
import mongoose from 'mongoose';
import restifyPlugins from 'restify-plugins'
import routes from './routes/index.js';

const config = require('../config');

const server = restify.createServer({
  name: config.name,
  version: config.version,
});
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());


server.listen(config.port, () => {
  // establish connection to mongodb
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db.uri);

	const db = mongoose.connection;

	db.on('error', (err) => {
	    console.error(err);
	    process.exit(1);
	});

	db.once('open', () => {
	    routes(server);
	    console.log(`Server is listening on port ${config.port}`);
	});
});