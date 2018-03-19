const fs = require('fs')

const db = require('../models')
const {getConfigSection} = require('../utils/config')
const serverConfig = (getConfigSection('server'))

const storage = (getConfigSection('storage'))
const supportedExtensions = storage.supportedExtensions

const indexFile = fs.readFileSync(`${serverConfig.clientPath}/index.html`, 'utf8')

module.exports = function (req, res) {
  db.Image.findOne({ where: { id: req.params.id } })
    .then(img => {
      let imgUrl = `${serverConfig.publicDomain}/media/${img.id}.${img.extension}`
      let descContent = `Uploaded ${supportedExtensions.image.includes(img.extension) ? 'image' : 'video'}`

      return img.getUser().then(user => {
        return res.send(indexFile.replace('<title>Nethloader</title>',
          `<title>Nethloader - Hosted media</title><meta name="twitter:card" content="photo"><meta name="twitter:title" content="${descContent}"><meta name="twitter:description" content="Self-hosted media via Nethloader"><meta name="twitter:image:src" content="${imgUrl}"><meta property="og:site_name" content="Nethloader"><meta property="og:title" content="${descContent}"><meta property="og:image" content="${imgUrl}"><meta property="og:description" content="Self-hosted media via Nethloader"><meta property="og:url" content="${serverConfig.publicDomain}/${img.id}">`)
          .replace('<body>', `<body><script id="meta-script">var ssrData = {found: true, id: "${img.id}", extension: "${img.extension}", createdAt: "${img.createdAt}", userId: "${user.id}"}</script>`)
        )
      })
    })
    .catch((err) => {
      return res.status(404).send(indexFile.replace('<body>', `<body><script>var ssrData = {found: false, id: null, extension: null, createdAt: null, userId: null, err: "${err}"}</script>`))
    })
}
