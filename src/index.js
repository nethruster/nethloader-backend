const express = require('express')
const graphqlHTTP = require('express-graphql')
const multer = require('multer')

const {getConfig} = require('./utils/config')

const authenticationMiddleware = require('./middlewares/authentication')
const apiUpload = require('./middlewares/api-upload')
const sharex = require('./middlewares/sharex')
const metaImageHandler = require('./middlewares/meta-image-handler')

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

const multerIstance = multer({
  storage: multer.memoryStorage()
}).single('file')

app.use('/graphql', authenticationMiddleware)
app.use('/graphql', multerIstance)

app.use('/graphql', graphqlHTTP(req => ({
  schema: schema,
  graphiql: config.env !== 'production',
  context: {
    currentUser: req.user,
    file: req.file
  }
})))

app.use('/api', multerIstance)
app.post('/api', apiUpload)
app.get('/sharex', sharex)
app.get('/:id([A-Za-z0-9_~]{10})', metaImageHandler)

app.listen(config.server.port, () => {
  console.log('Server listening on: ' + config.server.port)
})
