const db = require('./models')
const addImage = require('../utils/add-image')

module.exports = async function (req, res) {
  let key = req.headers['api-key']
  if (!key) return res.send(400, {success: false, error: 'Missing api-key header'})
  try {
    let user = await db.User.findOne({where: {apiKey: key}})
    if (!user) return res.send(400, {success: false, error: 'Invalid api-key'})
    let img = await addImage(user, req.files[0])

    return res.send(201, {success: true})
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }
}
