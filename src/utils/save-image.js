const fs = require('fs');
const path = require('path');

module.exports = function (id, extension, image) {
  fs.open(path.join(__dirname, "..", "..", "images", `${id}.${extension}`), 'w', (err, fd) => {
    if (err) {
      throw 'could not open file: ' + err;
    }

    fs.write(fd, image, 0, image.length, null, function (err) {
      if (err) throw 'error writing file: ' + err;
      fs.close(fd, function () {
        console.log('wrote the file successfully');
      });
    });
  })
}
