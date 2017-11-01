const fs = require('fs');
const path = require('path');
const db = require('../models')

module.exports = function (image) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, "..", "..", "images", `${image.id}.${image.extension}`), (err) => {
      if(err) {
        reject(err);
      }
      image.destroy()
      .then(() => resolve())
      .catch(err => reject(err))
    })
  })
}
