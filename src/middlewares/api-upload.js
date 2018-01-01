const db = require('../models')
const addImage = require('../utils/add-image')
const {getConfigSection} = require('../utils/config')

const publicDomain = (getConfigSection('server')).publicDomain
const unprocessableExtensions = (getConfigSection('storage')).supportedExtensions.unprocessableExtensions

module.exports = async function (req, res) {
  let key = req.headers['api-key']
  if (!key) return res.send(400, {success: false, error: 'Missing api-key header'})
  try {
    let user = await db.User.findOne({where: {apiKey: key}})
    if (!user) return res.send(400, {success: false, error: 'Invalid api-key'})
    let img = await addImage(user, req.file)
    let body
    switch (req.headers['output-format']) {
      case 'rawLink':
        body = `${publicDomain}/${img.id}`
        break
      case 'rawDirectLink':
        body = `${publicDomain}/media/${img.id}.${img.extension}`
        break
      default:
        let directLink = `${publicDomain}/media/${img.id}.${img.extension}`
        body = {
          success: true,
          data: {
            link: `${publicDomain}/${img.id}`,
            directLink: directLink,
            thumb: unprocessableExtensions.includes(img.extension) ? directLink : `${publicDomain}/media/${img.id}_thumb.jpg`
          }
        }
        break
    }

    return res.send(201, body)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}
