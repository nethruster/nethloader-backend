const fs = require('fs-extra')
const path = require('path')

const { getConfigSection } = require('./config')

let imagesPath = (getConfigSection('storage')).imagesPath

module.exports = function (user) {
  let id = user.id
  return user.destroy()
    .then(() => {
      return fs.remove(path.join(imagesPath, id))
    })
}
