const fs = require('fs')
const path = require('path')

const { getConfigSection } = require('./config')

let unprocessableExtensions = getConfigSection('unprocessableExtensions')

module.exports = function (image) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, '..', '..', 'images', `${image.id}.${image.extension}`), (err) => {
      if (err) {
        reject(err)
      }
      image.destroy()
        .then(() => resolve())
        .catch(err => reject(err))
    })

    // Remove thumbmnail
    if (!unprocessableExtensions.includes(image.extension)) {
      fs.unlink(path.join(__dirname, '..', '..', 'images', `${image.id}_thumb.jpg`), (err) => {
        if (err) {
          reject(err)
        }
        resolve()
      })
    }
  })
}
