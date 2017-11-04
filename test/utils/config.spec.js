const {expect} = require('chai');
const path = require('path');
const configUtils = require('../../src/utils/config');

describe('Config loader', function() {
  it('loads env config', function() {
    let config = configUtils.getConfig();
    let testConfig = {
      "server": {
        "address": "",
        "port": 4000,
        "serveImages": true,
        "cors": {
          "enabled": true,
          "options": {
            "origin": true
          }
        }
      },
      "security": {
        "jwtSecret": "AAA"
      },
      "storage": {
        "imagesPath": path.normalize(path.join(__dirname, "..", "..") + "/images")
      },
      "database": {
        "username": "root",
        "password": "123456",
        "database": "nethloader",
        "host": "localhost",
        "port": 3306,
        "dialect": "mysql"
      },
      "env": "test"
    };

    expect(config).to.deep.equal(testConfig);
  })
});
