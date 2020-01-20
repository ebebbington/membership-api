const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
const app = require('../../app')
const chaiHttp = require('chai-http')
const CardModel = require('../../models/CardModel')
const fs = require('fs')
const util = require('util')

const MongooseModel = require('../../schemas/CardSchema')

chai.use(chaiAsPromised)
chai.use(chaiHttp)
chai.should()

describe('Card Route', () => {

  describe.only('POST /card', () => {

    let testCardData = {}

    beforeEach('Re-assign the test data', () => {
      testCardData = {
        "employee_id": 1254,
        "name": "edward",
        "email": "eddobebo@hotmail.com",
        "phone_number": "01234567891",
        "pin": 1234,
        "amount": 20
      }
    })

    it('Should fail when no employee id is passed in', (done) => {
      testCardData.employee_id = null
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
    })

    it('Should fail when no name is passed in', (done) => {
      testCardData.name = null
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
    })

    it('Should fail when no email is passed in', (done) => {
      testCardData.email = null
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
    })

    it('Should fail when no phone number is passed in', (done) => {
        testCardData.phone_number = null
        chai.request(app)
          .post('/api/v1/card')
          .send(testCardData)
          .end((err, res) => {
            expect(res.status).to.equal(400)
            const json = JSON.parse(res.text)
            expect(json.success).to.equal(false)
            done()
          })
    })

    it('Should fail when no pin is passed in', (done) => {
      testCardData.pin = null
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
    })

    it('Should fail when no amount is passed in', (done) => {
      testCardData.amount = null
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(false)
          done()
        })
    })

    it('Should respond with a welcome message if card already exists with PIN and Employee ID', async () => {
      // Create a card first
      const card = new MongooseModel(testCardData)
      await card.save()
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end(async (err, res) => {
          expect(res.status).to.equal(200)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(true)
          expect(json.message).to.equal('Welcome ' + testCardData.name)
          await MongooseModel.deleteMany({pin: testCardData.pin})
        })
    })

    it('Should register on a successful request', async () => {
      chai.request(app)
        .post('/api/v1/card')
        .send(testCardData)
        .end(async (err, res) => {
          expect(res.status).to.equal(200)
          const json = JSON.parse(res.text)
          expect(json.success).to.equal(true)
          await MongooseModel.deleteMany({pin: testCardData.pin})
        })
    })

  })

  describe('PUT /card/topup',  function () {

  })

})