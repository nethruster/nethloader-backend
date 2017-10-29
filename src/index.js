const express = require('express');
const graphqlHTTP = require('express-graphql');
const multer = require('multer');

const config = require('./utils/config');

const authenticationMiddleware = require('./middlewares/authentication');

const schema = require('./graphql/schema');

const app = express();

if(config.cors.enabled) {
  const cors = require('cors');
  app.use(cors(config.cors.options));
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

app.listen(config.port);
