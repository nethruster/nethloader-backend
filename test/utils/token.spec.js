const {expect} = require('chai')
const tokenUtils = require('../../src/utils/token')

describe('Token utils', function () {
  it('sign', function () {
    return tokenUtils.sign({data: 'Lorem ipsum'})
  })
  it('verify valid token', function () {
    tokenUtils.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiTG9yZW0gaXBzdW0iLCJpYXQiOjE1MDk0MDcwNDV9.HZIpIP5K0S7sHqSaUWieLxbjgckFaG0aCQ4s-nW6P70')
  })
  it('verify expired token', function () {
    return new Promise(function (resolve, reject) {
      tokenUtils.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiTG9yZW0gaXBzdW0iLCJpYXQiOjE1MDk0MDgyOTksImV4cCI6MTUwOTQwODMwMH0.MTHNha5JWUHWAnmZFOfYUTrAR2FLvtqVyv-JcJUPJHE')
        .then(data => reject('The token should be marked as invalid but it was marked as valid'))
        .catch(err => {
          try {
            expect(err.name).to.equal('TokenExpiredError')
          } catch (e) {
            reject(e)
          }
          resolve()
        })
    })
  })
  it('verify bad secret token', function () {
    return new Promise(function (resolve, reject) {
      tokenUtils.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiTG9yZW0gaXBzdW0iLCJpYXQiOjE1MDk0MDkzMDJ9.9egi5upVx_HE62_xCI0hT3KH9WQwFXQ4et6ZmbXYuBA')
        .then(data => reject('The token should be marked as invalid but it was marked as valid'))
        .catch(err => {
          try {
            expect(err.name).to.equal('JsonWebTokenError')
          } catch (e) {
            reject(e)
          }
          resolve()
        })
    })
  })
  it('verify invalid token', function () {
    return new Promise(function (resolve, reject) {
      tokenUtils.verify('Not a token')
        .then(data => reject('The token should be marked as invalid but it was marked as valid'))
        .catch(err => {
          try {
            expect(err.name).to.equal('JsonWebTokenError')
          } catch (e) {
            reject(e)
          }
          resolve()
        })
    })
  })
})
