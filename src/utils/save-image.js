const fs = require('fs');
const path = require('path');

module.exports = function (id, extension, image) {
  return new Promise((resolve, reject) => {
    fs.open(path.join(__dirname, "..", "..", "images", `${id}.${extension}`), 'w', (err, fd) => {
      if (err) {
        return reject(err);
      }
  
      fs.write(fd, image, 0, image.length, null, function (err) {
        if (err) return reject(err);
        fs.close(fd, function () {
          return resolve();
        });
      });
    })
  });
}
