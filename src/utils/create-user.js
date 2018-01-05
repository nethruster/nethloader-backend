const bcrypt = require('bcrypt')
const db = require('../models')

module.exports = async function ({name, email, password, isAdmin = false}) {
  return db.User.create({
    id: db.User.generateId(),
    name: name,
    email: email,
    apiKey: db.User.generateApiKey(),
    isAdmin: isAdmin,
    sessionSignature: db.User.generateSessionSignature(),
    password: await bcrypt.hash(password, 12)
  })
}
