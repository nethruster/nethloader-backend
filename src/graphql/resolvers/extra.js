const {getConfigSection} = require('../../utils/config')
let storage = getConfigSection('storage')

module.exports = {
  Query: {
    IsCurrentSessionValid: (parent, args, { currentUser }) => !!currentUser,
    supportedImageExtensions: (parent, args, ctx) => storage.supportedExtensions.image,
    supportedVideoExtensions: (parent, args, ctx) => storage.supportedExtensions.video,
    unprocessableExtensions: (parent, args, ctx) => storage.unprocessableExtensions
  }
}
