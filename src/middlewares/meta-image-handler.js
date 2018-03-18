const fs = require('fs')

const db = require('../models')
const {getConfigSection} = require('../utils/config')
const serverConfig = (getConfigSection('server'))

const indexFile = fs.readFileSync(`${serverConfig.clientPath}/index.html`, 'utf8')

module.exports = function (req, res) {
  db.Image.findOne({ where: { id: req.params.id } })
    .then(img => {
      return res.send(indexFile.replace('<title>Nethloader</title>',
        `<title>Screenshot hosted with Nethloader</title>
        <meta name="twitter:card" content="photo">
        <meta name="twitter:title" content="Hosted media">
        <meta name="twitter:site" content="@nethruster">
        <meta name="twitter:description" content="Hosted with Nethloader">
        <meta name="twitter:image:src" content="${serverConfig.publicDomain}/media/${img.id}.${img.extension}">
        <meta property="og:site_name" content="Nethloader">
        <meta property="og:title" content="Hosted media">
        <meta property="og:image" content="${serverConfig.publicDomain}/media/${img.id}.${img.extension}">
        <meta property="og:description" content="Hosted with Nethloader">
        <meta property="og:url" content="${serverConfig.publicDomain}/${img.id}">
        `))
    })
    .catch(() => {
      return res.status(404).send(indexFile)
    })
}
