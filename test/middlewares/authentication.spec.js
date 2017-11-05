const path = require('path');
const sinon = require('sinon');
const sequelizeMockingMocha = require('sequelize-mocking').sequelizeMockingMocha;
const {expect} = require('chai');

describe("Authentication middleware", function() {
  const database = require('../../src/models');

  let sandbox = null;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox && sandbox.restore();
  });
  sequelizeMockingMocha(
    database.sequelize,
    path.resolve(path.join(__dirname, '../data/database.json')),
    { 'logging': false }
  );

  const authentication = require("../../src/middlewares/authentication")

  it('Login with a valid token', function(done) {
    let req = {
      headers: {
        authentication: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZoaDJUYmdIX3YiLCJzZXNzaW9uU2lnbmF0dXJlIjoib2toOU9jdEZUNnVTb34zaGNUaE1nTXlkIiwiaXNBZG1pbiI6IjEiLCJpYXQiOjE1MDk4MjI0Mjl9.6hw9A0Z7lGbep4g-FB8XsJZsxTbi595snY4aTVPEhi8"
      },
      next: () => {
        expect(req.user).to.be.an('object');
        done();
      }
    };

    authentication(req);
  });
  it('Login with a invalid token', function(done) {
    let req = {
      headers: {
        authentication: "Invalid"
      },
      next: () => {
        try {
          expect(req.user).to.be.null;
          done();
        } catch(err) {
          done(err);
        }
      }
    };

    authentication(req);
  });
});
