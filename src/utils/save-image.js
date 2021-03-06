const fs = require('fs')
const path = require('path')

const {getConfigSection} = require('./config')
const generateMediaThumbnail = require('./generate-thumbnail')

let storage = getConfigSection('storage')

module.exports = function (id, userId, extension, mimetype, image) {
  return new Promise((resolve, reject) => {
    fs.open(path.join(storage.imagesPath, userId, `${id}.${extension}`), 'w', (err, fd) => {
      if (err) {
        return reject(err)
      }

      fs.write(fd, image, 0, image.length, null, function (err) {
        if (err) return reject(err)
        fs.close(fd, async function () {
          await generateMediaThumbnail(id, userId, extension, mimetype)
          return resolve()
        })
      })
    })
  })
}
