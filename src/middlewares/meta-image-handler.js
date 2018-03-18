const fs = require('fs')

const db = require('../models')
const {getConfigSection} = require('../utils/config')
const serverConfig = (getConfigSection('server'))

const indexFile = fs.readFileSync(`${serverConfig.clientPath}/index.html`, 'utf8')

module.exports = function (req, res) {
  db.Image.findOne({ where: { id: req.params.id } })
    .then(img => {
      return res.send(indexFile.replace('<title>Nethloader</title>',
        `<title>Screenshot hosted with Nethloader</title><meta property="og:image" content="${serverConfig.publicDomain}/media/${img.id}.${img.extension}" />`))
    })
    .catch(() => {
      return res.status(404).send(indexFile)
    })
}
