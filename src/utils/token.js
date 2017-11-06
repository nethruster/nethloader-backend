const jwt = require('jsonwebtoken');

const {getConfigSection} = require('./config');

var securiyConfig = getConfigSection("security");

function verify(token) {
  return new Promise((resolve, reject) =>{
    jwt.verify(token, securiyConfig.jwtSecret, (err, decoded) => {
      if(err) {
        return reject(err)
      }
      return resolve(decoded)
    });
  });
}

function sign(data, expiresIn) {
  return new Promise((resolve, reject) => {
    const options = {};
    if(expiresIn) {
      options.expiresIn = expiresIn
    }
    jwt.sign(
      data,
      securiyConfig.jwtSecret,
      options,
      (err, token) => {
        if(err) {
          return reject(err);
        }
        return resolve(token);
      }
    )
  });
}

function generateUserToken(user, expiresIn) {
  return sign(
    {
      id: user.id,
      sessionSignature: user.sessionSignature
    },
    expiresIn
  )
}

module.exports = {
  verify,
  sign,
  generateUserToken
}
