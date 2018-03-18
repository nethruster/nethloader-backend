const fs = require('fs')

const db = require('../models')
const {getConfigSection} = require('../utils/config')
const serverConfig = (getConfigSection('server'))

const indexFile = fs.readFileSync(`${serverConfig.clientPath}/index.html`, 'utf8')

module.exports = function (req, res) {
  db.Image.findOne({ where: { id: req.params.id } })
    .then(img => {
      let imgUrl = `${serverConfig.publicDomain}/media/${img.id}.${img.extension}`
      return res.send(indexFile.replace('<title>Nethloader</title>',
        `<title>Screenshot hosted with Nethloader</title><meta name="twitter:card" content="photo"><meta name="twitter:title" content="Hosted media"><meta name="twitter:description" content="Hosted with Nethloader"><meta name="twitter:image:src" content="${imgUrl}"><meta property="og:site_name" content="Nethloader"><meta property="og:title" content="Hosted media"><meta property="og:image" content="${imgUrl}"><meta property="og:description" content="Hosted with Nethloader"><meta property="og:url" content="${serverConfig.publicDomain}/${img.id}">`)
        .replace('<body>', `<body><script>var ssrData = {found: true, id: "${img.id}", extension: "${img.extension}", createdAt: ${img.createdAt}}</script>`)
      )
    })
    .catch(() => {
      return res.status(404).send(indexFile.replace('<body>', '<body><script>var ssrData = {found: false, id: null, extension: null}</script>'))
    })
}
