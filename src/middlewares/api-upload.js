const db = require('../models')
const addImage = require('../utils/add-image')
const {getConfigSection} = require('../utils/config')

const publicDomian = (getConfigSection('server')).publicDomian

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
        body = `${publicDomian}/${img.id}`
        break
      case 'rawDirectLink':
        body = `${publicDomian}/media/${img.id}.${img.extension}`
        break
      default:
        body = {
          success: true,
          data: {
            link: `${publicDomian}/${img.id}`,
            directLink: `${publicDomian}/media/${img.id}.${img.extension}`
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
