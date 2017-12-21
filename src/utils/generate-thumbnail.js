const thumb = require('node-thumbnail').thumb
const Ffmpeg = require('fluent-ffmpeg')
const path = require('path')

const { getConfigSection } = require('./config')

let storage = getConfigSection('storage')

module.exports = function (imageId, extension, mimetype) {
  const source = path.join(storage.imagesPath, `${imageId}.${extension}`)

  return new Promise((resolve, reject) => {
    if (storage.unprocessableExtensions.includes(extension)) { // Skip over formats we can't create a thumbnail of off
      resolve()
    } else if (storage.supportedExtensions.video.includes(extension)) { // Handle video thumbnails
      new Ffmpeg(source)
        .takeScreenshots({
          count: 1,
          folder: storage.imagesPath,
          filename: `${imageId}_thumb.jpg`,
          quiet: true,
          size: '100x?',
          timemarks: ['0.5']
        }).on('end', () => {
          return resolve()
        }).on('error', (err) => {
          console.log(err)
          return reject(err)
        })
    } else { // Handle image thumbnails
      thumb({
        source: source,
        destination: storage.imagesPath,
        width: 100,
        quiet: true,
        extension: '.jpg'
      }).then(function () {
        console.log(`generate-thumbnail: Created thumbnail for image ${imageId}`)
        return resolve()
      }).catch(function (err) {
        return reject(err)
      })
    }
  })
}
