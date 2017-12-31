const bcrypt = require('bcrypt')
const db = require('../models')

module.exports = async function({name, email, password}) {
  return db.User.create({
    id: db.User.generateId(),
    name: name,
    email: email,
    apiKey: db.User.generateApiKey(),
    sessionSignature: db.User.generateSessionSignature(),
    password: await bcrypt.hash(password, 12)
  })
}
