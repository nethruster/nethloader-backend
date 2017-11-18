const fs = require('fs')
const os = require('os')
const path = require('path')

let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

function readConfigFile (name) {
  let filePath = path.join(__dirname, '..', '..', 'config', name + '.json')
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {}
    } else {
      throw err
    }
  }
}

const config = readConfigFile('config')

if (Object.keys(config).length === 0) {
  throw new Error('Not config file or empty config file found.')
}

Object.assign(config, readConfigFile(env + '.env.config'))
Object.assign(config, readConfigFile((os.hostname()).toLowerCase + '.machine.config'))

config.storage.imagesPath = path.normalize(config.storage.imagesPath.replace('$appdir', path.join(__dirname, '..', '..')))
config.env = env
if (process.env.PORT) {
  config.server.port = process.env.PORT
}

function getConfig () {
  return config
}
function getConfigSection (section) {
  return config[section]
}

module.exports = {
  getConfig,
  getConfigSection
}
