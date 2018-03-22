const mime = require('mime-types')
const db = require('../models')

const saveImage = require('./save-image')

module.exports = async function (user, file) {
  let ext = mime.extension(file.mimetype)
  let img = await user.createImage({
    id: db.Image.generateId(),
    extension: ext
  })

  await saveImage(img.id, img.UserId, ext, file.mimetype, file.buffer)

  return img
}
