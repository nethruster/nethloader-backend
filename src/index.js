const express = require('express')
const graphqlHTTP = require('express-graphql')
const multer = require('multer')

const {getConfig} = require('./utils/config')

const authenticationMiddleware = require('./middlewares/authentication')
const apiUpload = require('./middlewares/api-upload')

const schema = require('./graphql/schema')

const config = getConfig()
const app = express()

if (config.server.cors.enabled) {
  const cors = require('cors')
  app.use(cors(config.server.cors.options))
}

if (config.server.serveImages) {
  app.use('/media', express.static(config.storage.imagesPath))
}

app.use('/graphql', authenticationMiddleware)
app.use('/graphql', multer({
  storage: multer.memoryStorage()
}).single('file'))

app.use('/graphql', graphqlHTTP(req => ({
  schema: schema,
  graphiql: config.env !== 'production',
  context: {
    currentUser: req.user,
    file: req.file
  }
})))

app.use('/api', multer({
  storage: multer.memoryStorage()
}).single('file'))
app.post('/api', apiUpload)

app.listen(config.server.port, () => {
  console.log('The server is listen in port: ' + config.server.port)
})
