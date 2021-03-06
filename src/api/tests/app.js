const chai = require('chai')
const expect = chai.expect
const app = require('.././app')
const mongoose = require('mongoose')
chai.should()

describe('App', () => {

  describe('Middleware', () => {

    it('Should be using body parser', () => {
      let found = false
      app._router.stack.forEach(stackObj => {
        if (stackObj.name === 'jsonParser')
          found = true
      });
      expect(found).to.equal(true)
    })

  })

  describe('Database', () => {

    it('Should have connected to the database', () => {
      expect(mongoose.connection.readyState).to.equal(1)
    })

    it('Should successfully disconnect from the database', (done) => {
      mongoose.connection.close().then(() => {
        expect(mongoose.connection.readyState).to.equal(0)
        done()
      })
    })

  })

  describe('Environment', () => {

    it('Environment should match the one in the .env file', () => {
      const env = process.env.NODE_ENV
      expect(app.settings.env).to.equal(env)
    })

  })
})