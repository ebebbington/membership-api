import 'mocha'

const chai = require('chai')
const expect = chai.expect

const rewire = require('rewire')
const CardModel = rewire('../../models/CardModel')
import BaseModel from '../../models/BaseModel'

const mongoose = require('mongoose')
require('dotenv').config()
const dbUrl = process.env.DB_URL
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

chai.should()

describe('Card Model', () => {

    it('Should extend BaseModel', () => {
        const doesExtendBaseModel = CardModel.prototype instanceof BaseModel
        expect(doesExtendBaseModel).to.equal(true)
    })

    describe('Properties', () => {

        describe('_id', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card._id
                expect(Card).to.haveOwnProperty('_id')
            })

        })

        describe('employee_id', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.employee_id
                expect(Card).to.haveOwnProperty('employee_id')
            })

        })

        describe('phone_number', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.phone_number
                expect(Card).to.haveOwnProperty('phone_number')
            })

        })

        describe('pin', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.pin
                expect(Card).to.haveOwnProperty('pin')
            })

        })

        describe('amount', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.amount
                expect(Card).to.haveOwnProperty('amount')
            })

        })

        describe('name', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.name
                expect(Card).to.haveOwnProperty('name')
            })

        })

        describe('email', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.email
                expect(Card).to.haveOwnProperty('email')
            })

        })

        describe('tablename', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                const type = typeof Card.tablename
                expect(Card).to.haveOwnProperty('tablename')
            })

            it('Should equal Card', () => {
                const Card = new CardModel
                expect(Card.tablename).to.equal('Card')
            })

        })

        describe('exposables', () => {

            it('Should be defined', () => {
                const Card = new CardModel
                expect(Array.isArray(Card.exposables)).to.equal(true)
                expect(Card).to.haveOwnProperty('exposables')
            })

            it('Should expose the correct properties', () => {
                const Card = new CardModel
                const exposables = ['_id', 'employee_id', 'name', 'email', 'phone_number', 'pin', 'amount']
                Card.exposables.forEach((val: string) => {
                    const isIncluded = exposables.includes(val)
                    expect(isIncluded).to.equal(true)
                })
            })

        })

    })

    describe('Methods', () => {

        describe('getMongooseModel', () => {

            it('Should exist and return the Mongoose Model', () => {
                const Card = new CardModel
                const MongooseModel = Card.getMongooseModel()
                expect(MongooseModel).to.exist
            })

        })

    })

})