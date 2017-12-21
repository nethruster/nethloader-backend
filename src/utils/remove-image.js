const fs = require('fs')
const path = require('path')

const { getConfigSection } = require('./config')

let storage = getConfigSection('storage')

module.exports = function (image) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(storage.imagesPath, `${image.id}.${image.extension}`), (err) => {
      if (err) {
        reject(err)
      }
      image.destroy()
        .then(() => resolve())
        .catch(err => reject(err))
    })

    // Remove thumbmnail
    if (!storage.unprocessableExtensions.includes(image.extension)) {
      fs.unlink(path.join(storage.imagesPath, `${image.id}_thumb.jpg`), (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    }
  })
}
