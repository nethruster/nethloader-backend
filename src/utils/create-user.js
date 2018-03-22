const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')

const db = require('../models')
const {getConfigSection} = require('./config')

const imagePath = (getConfigSection('storage')).imagesPath

module.exports = async function ({name, email, password, isAdmin = false}) {
  return db.User.create({
    id: db.User.generateId(),
    name: name,
    email: email,
    apiKey: db.User.generateApiKey(),
    isAdmin: isAdmin,
    sessionSignature: db.User.generateSessionSignature(),
    password: await bcrypt.hash(password, 12)
  }).then(user => {
    fs.mkdirSync(path.join(imagePath, user.id))
    return user
  })
}
