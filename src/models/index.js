'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const {getConfigSection} = require('../utils/config')

// const isDevelopment = getConfigSection('env') === 'development'
const basename = path.basename(module.filename)
var db = {}

var sequelize = new Sequelize(getConfigSection('database'))

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.includes('.')) && (file !== basename) && (file.endsWith('.js'))
  })
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

// if (isDevelopment) {
//   (require('../utils/add-fake-entries'))(db).catch(err => {throw err;});
// }

module.exports = db
