const path = require('path')
const sinon = require('sinon')
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha
const {expect} = require('chai')

describe('Login verifier', function () {
  const database = require('../../src/models')

  let sandbox = null

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
  })
  afterEach(function () {
    sandbox && sandbox.restore()
  })
  sequelizeMockingMocha(
    database.sequelize,
    path.resolve(path.join(__dirname, '../data/database.json')),
    { 'logging': false }
  )

  const verifyLogin = require('../../src/utils/verify-login')

  it('Verify a valid session token', function () {
    return verifyLogin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZoaDJUYmdIX3YiLCJzZXNzaW9uU2lnbmF0dXJlIjoib2toOU9jdEZUNnVTb34zaGNUaE1nTXlkIiwiaXNBZG1pbiI6IjEiLCJpYXQiOjE1MDk4MjI0Mjl9.6hw9A0Z7lGbep4g-FB8XsJZsxTbi595snY4aTVPEhi8')
  })
  it('Verify a session token with invalid sessionSignature', function () {
    return new Promise(function (resolve, reject) {
      verifyLogin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZoaDJUYmdIX3YiLCJzZXNzaW9uU2lnbmF0dXJlIjoiSW52YWxpZCIsImlzQWRtaW4iOiIxIiwiaWF0IjoxNTA5ODI1OTk0fQ.7-UxwW1bwcwNXbC-QcZiK2g_Dcw9T0gZnFt1cIN-3Ag')
        .then(data => reject('The token should be marked as invalid but it was marked as valid'))
        .catch(err => {
          try {
            expect(err.message).to.equal('Invalid sessionSignature')
          } catch (e) {
            reject(e)
          }
          resolve()
        })
    })
  })
  it('Verify a session token with invalid sessionSignature', function () {
    return new Promise(function (resolve, reject) {
      verifyLogin('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ik5vIGlkIiwic2Vzc2lvblNpZ25hdHVyZSI6Im9raDlPY3RGVDZ1U29-M2hjVGhNZ015ZCIsImlzQWRtaW4iOiIxIiwiaWF0IjoxNTA5ODI2NDYyfQ.UEn0SZb8G2lUNuBX5gIkqDcxre0AfJgo9ML2YB5Hh04')
        .then(data => reject('The token should be marked as invalid but it was marked as valid'))
        .catch(err => {
          try {
            expect(err.message).to.equal('Invalid user')
          } catch (e) {
            reject(e)
          }
          resolve()
        })
    })
  })
})
