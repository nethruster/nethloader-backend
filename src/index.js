const express = require('express');
const graphqlHTTP = require('express-graphql');
const multer = require('multer');

const {getConfig} = require('./utils/config');

const authenticationMiddleware = require('./middlewares/authentication');

const schema = require('./graphql/schema');

const config = getConfig();
const app = express();

if(config.server.cors.enabled) {
  const cors = require('cors');
  app.use(cors(config.server.cors.options));
}

if(config.server.serveImages) {
  app.use('/media', express.static(config.storage.imagesPath));
}

app.use('/graphql', authenticationMiddleware);
app.use('/graphql', multer({
  storage: multer.memoryStorage()
}).array('files'))

app.use('/graphql', graphqlHTTP(req => ({
  schema: schema,
  graphiql: config.env !== "production",
  context: {
    currentUser: req.user,
    files: req.files
  }
})));

app.listen(config.server.port);
