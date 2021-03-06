import 'mocha' // Because this file was throwing TS errors about 'cannot find name desscribe' etc

//
// Run this test using: mocha -r ts-node/register <test file>
//

const chai = require('chai')
const expect = chai.expect
chai.should()
require('dotenv').config()
const dbUrl = process.env.DB_URL
const mongoose = require('mongoose')
mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})

import BaseModel from '../../models/BaseModel'
import { Model } from 'mongoose'
const Schema = mongoose.Schema
const schema = new Schema({
  forename: {
    required: true,
    type: String
  },
  surname: String,
  postcode: String,
  age: Number
});
const MongooseModel = mongoose.model('Test', schema);

class TestModel extends BaseModel {

  //
  // Implemented abstract properties
  //
  public exposables: string[] = [
    'forename',
    'surname',
    'age'
  ]
  public tablename: string = 'Test'

  //
  // Custom properties
  //

  public age: number|null = null
  public forename: string|null = null
  public surname: string|null = null
  public postcode: string|null = null
  public fullname: string|null = null

  //
  // Constructor
  //

  constructor (props?: {forename: any, surname: any, postcode: any, age: any}) {
    super() // requires no props
    if (props) {
      if (props.forename) this.forename = props.forename || null

      if (props.surname) this.surname = props.surname || null

      this.fullname = this.forename && this.surname ? this.forename + ' ' + this.surname : null

      if (props.age) this.age = props.age || null

      if (props.postcode) this.postcode = props.postcode || null
    }
  }

  //
  // Abstract methods
  //

  public getMongooseModel (): Model<any> {
    return MongooseModel
  }
}

describe('BaseModel', () => {

  describe('Properties', () => {

    describe('exposables', () => {

      it('Should be an abstract property', () => {
        const Test = new TestModel
        const hasProp: boolean = Test.hasOwnProperty('exposables')
        expect(hasProp).to.equal(true)
      })

    })

    describe('tablename', () => {

      it('Should be an abstract property', () => {
        const Test = new TestModel
        const hasProp = Test.hasOwnProperty('tablename')
        expect(hasProp).to.equal(true)
      })

    })

  })

  describe('Methods', () => {

    describe('find', () => {

      it('Should return false if a query _id was passed in and failed parsing', async () => {
        const Test = new TestModel
        const result = await Test.find({_id: '5'})
        expect(result).to.equal(false)
      })

      it('Should correctly query when limit isnt defined', async () => {
        // insert one
        const document = new MongooseModel({
          forename: 'Hello'
        })
        await document.save()
        const Test = new TestModel
        const result: any = await Test.find()
        expect(result[0].forename).to.equal('Hello')
        await MongooseModel.deleteMany({})
      })

      it('Should correctly query when limit is defined', async () => {
        // insert 4
        let document = new MongooseModel({forename: 'Hello'})
        await document.save()
        document = new MongooseModel({forename: 'Hello2'})
        await document.save()
        document = new MongooseModel({forename: 'Hello3'})
        await document.save()
        document = new MongooseModel({forename: 'Hello4'})
        await document.save()
        const Test = new TestModel
        const result: any = await Test.find(undefined, 4)
        expect(result.length).to.equal(4)
        await MongooseModel.deleteMany({})
      })

      it('Should correctly query when query isnt defined', async () => {
        const document = new MongooseModel({
          forename: 'Hello'
        })
        await document.save()
        const Test = new TestModel
        const result: any = await Test.find(undefined)
        expect(result[0].forename).to.equal('Hello')
        await MongooseModel.deleteMany({})
      })

      it('Should correctly query when query is defined', async () => {
        const document = new MongooseModel({
          forename: 'Edwuardo'
        })
        await document.save()
        const Test = new TestModel
        const result: any = await Test.find({forename: 'Edwuardo'})
        expect(result[0].forename).to.equal('Edwuardo')
        await MongooseModel.deleteMany({})
      })

      it('Should correctly query when sortables is defined', async () => {
        let document = new MongooseModel({forename: 'Edwuardo'})
        await document.save()
        document = new MongooseModel({forename: 'Kenny'})
        await document.save()
        document = new MongooseModel({forename: 'Zelda'})
        await document.save()
        const Test = new TestModel
        const sortables = {forename: 'desc'}
        const result: any = await Test.find({}, 3, sortables)
        expect(result[0].forename).to.equal('Zelda')
        expect(result[1].forename).to.equal('Kenny')
        expect(result[2].forename).to.equal('Edwuardo')
        await MongooseModel.deleteMany({})
      })

      it('Should return false when no results were found', async () => {
        const Test = new TestModel
        const result: any = await Test.find({name: 'I dont exist'})
        expect(result).to.equal(false)
      })

      it('Should return a document and fill if a single result was found', async () => {
        const document = new MongooseModel({
          forename: 'Edwuardo',
          surname: 'Bebbingtano',
          postcode: 'NG31 88Y',
          age: 21
        })
        await document.save()
        const Test = new TestModel
        const result: any = await Test.find({forename: 'Edwuardo'})
        expect(result.length).to.equal(1)
        expect(result[0].forename).to.equal('Edwuardo')
        expect(result[0].surname).to.equal('Bebbingtano')
        expect(result[0].postcode).to.not.exist
        expect(result[0].age).to.equal(21)
        expect(Test.forename).to.equal('Edwuardo')
        expect(Test.surname).to.equal('Bebbingtano')
        expect(Test.postcode).to.equal(null)
        expect(Test.age).to.equal(21)
        await MongooseModel.deleteMany({})
      })

      it('Should return an array of results when query resulted in more than 1 document', async () => {
        let document = new MongooseModel({forename: 'Edwuardo'})
        await document.save()
        let document2 = new MongooseModel({forename: 'Kenny'})
        await document2.save()
        let document3 = new MongooseModel({forename: 'Zelda'})
        await document3.save()
        const Test = new TestModel
        const result: any = await Test.find({}, 2)
        expect(result.length).to.equal(2)
      })

    })

    describe('delete', () => {

      it('Should return false if an query _id is passed in but cannot be parsed', async () => {
        const Test = new TestModel
        const result = await Test.delete({_id: '5'})
        expect(result).to.equal(false)
      })

      it('Should return true if successful deleteOne', async () => {
        const document = new MongooseModel({forename: 'Edward'})
        await document.save()
        const Test = new TestModel
        const result = await Test.delete({forename: 'Edward'})
        expect(result).to.equal(true)
        await MongooseModel.deleteMany({})
      })

      it('Should return false on unsuccessful deleteOne', async () => {
        const Test = new TestModel
        const result = await Test.delete({forename: 'Edward'})
        expect(result).to.equal(false)
      })

      it('Should return true on successful deleteMany', async () => {
        const document = new MongooseModel({forename: 'Edward'})
        await document.save()
        const Test = new TestModel
        const result = await Test.delete({forename: 'Edward'}, true)
        expect(result).to.equal(true)
        await MongooseModel.deleteMany({})
      })

      it('Should return false on unsuccessful deleteMany', async () => {
        const Test = new TestModel
        const result = await Test.delete({forename: 'Edward'}, true)
        expect(result).to.equal(false)
      })

      it('Should return false is query is empty and deleteMany is true', async () => {
        const Test = new TestModel
        const result = await Test.delete({}, true)
        expect(result).to.equal(false)
      })

      it('Should empty the models on a successful deletion', async () => {
        const document = new MongooseModel({forename: 'Edward'})
        await document.save()
        const Test = new TestModel
        await Test.find({forename: 'Edward'})
        expect(Test.forename).to.equal('Edward')
        const result = await Test.delete({forename: 'Edward'})
        expect(result).to.equal(true)
      })

    })

    describe('getMongooseModel', () => {

      it('Should exist and only return the Document', () => {
        const Test = new TestModel

        const doc = Test.getMongooseModel()
        expect(doc).to.exist
      })

    })

    describe('update', () => {

      it('Should return false if no document was found with the models id')

      it('Should return the old document after updating', async () => {
        const document = new MongooseModel({forename: 'Edwuardo'})
        await document.save()
        const Test = new TestModel
        const oldDocument: any = await Test.update({forename: 'Edwuardo'}, {forename: 'Harry Potter'})
        expect(oldDocument.forename).to.equal('Edwuardo')
        await MongooseModel.deleteMany({})
      })

      it('Should fill the calling model on success', async () => {
        const document = new MongooseModel({
          forename: 'Edwuardo',
          age: 102
        })
        await document.save()
        const Test = new TestModel
        const oldDocument: any = await Test.update({forename: 'Edwuardo'}, {forename: 'Harry Potter'})
        expect(oldDocument.forename).to.equal('Edwuardo')
        expect(Test.forename).to.equal('Harry Potter')
        expect(Test.age).to.equal(102)
        await MongooseModel.deleteMany({})
      })

    })

    describe('`create`', function () {

      it('Should fill the model on a successful creation', async () => {
        const Test = new TestModel
        const data = {forename: 'Edward', surname: 'Bebbingtano'}
        const err = await Test.create(data)
        expect(err).to.not.exist
        expect(Test.forename).to.equal('Edward')
        expect(Test.surname).to.equal('Bebbingtano')
        await MongooseModel.deleteMany({})
      })

      it('Should fail when validation isnt met', async () => {
        const Test = new TestModel
        const err = await Test.create({forename: ''})
        const fieldName: string = Object.keys(err.errors)[0]
        const errorMessage: string = err.errors[fieldName].message
        expect(fieldName).to.equal('forename')
      })

    })


    // skipped because i dont have a way to test private methods of an abstract class
    describe.skip('generateObjectId', () => {

      const Test = new TestModel()
      const Schema = mongoose.Schema
      const ObjectIdType = Schema.ObjectId
      const stringId = '4edd40c86762e0fb12000003'

      it.skip('Should return a mongoose object id on a successful parse', () => {
        //const objectId = Test.generateObjectId(stringId)
        //const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
        //expect(isValidObjectId).to.equal(true)
      })

      it.skip('Should return the passed in id when already a mongoose id', () => {
        //const objectId = mongoose.Types.ObjectId()
        //const objectId2 = Base.generateObjectId(objectId)
        //expect(objectId).to.equal(objectId2)
      })

      it.skip('Should return false when failed to convert', () => {
        //const invalidStringId = '5'
        //const objectId = Base.generateObjectId(invalidStringId)
        //expect(objectId).to.equal(false)
      })

      it.skip('Should be a protected method', () => {
        //const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
        //const objectId = Test.generateObjectId(stringId)
        //const isValidObjectId = mongoose.Types.ObjectId.isValid(objectId)
        //expect(isValidObjectId).to.equal(true)
      })

    })

    // Skipped because i havent found a way to access private mthods on an 'import'ed module
    describe.skip('stripNonExposableProperties', () => {

      // commented out because see above comment
      // it('Should remove properties from a model that arent in `fieldsToExpose`', () => {
      //     const exampleDoc = {
      //         _id: 'mongoose object id',
      //         forename: 'Edward',
      //         surname: 'Bebbington',
      //         age: 21,
      //         postcode: 'NG31 8FY'
      //     }
      //     const Test = new TestModel
      //     const stripped: any = Test.stripNonExposableProperties(exampleDoc)
      //     expect(stripped._id).to.not.exist
      //     expect(stripped.forename).to.equal(exampleDoc.forename)
      //     expect(stripped.surname).to.equal(exampleDoc.surname)
      //     expect(stripped.age).to.equal(exampleDoc.age)
      //     expect(stripped.postcode).to.not.exist
      // })

    })

    // skipped because i have no way to test private methods of an abstract class
    describe.skip('fill', () => {

      it.skip('Should set the matching properties in fieldsToExpose of the passed in document', () => {
        const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
        // Mimick a DB document
        const doc = {
          $__: false,
          isNew: false,
          errors: false,
          _doc: {
            forename: 'TESTFORENAME',
            surname: 'TESTSURNAME',
            age: 100,
            postcode: 'TESTPOSTCODE'
          },
          $locals: false
        }
        //Test.fill(doc)
      })

    })

    // skipped because i cant test private methods of an abstract class
    describe.skip('empty', () => {

      it.skip('Should empty the models properties by their fieldsToExpose', () => {
        const Test = new TestModel({forename: null, surname: null, age: null, postcode: null})
        const doc = {
          $__: false,
          isNew: false,
          errors: false,
          _doc: {
            forename: 'TESTFORENAME',
            surname: 'TESTSURNAME',
            age: 100,
            postcode: 'TESTPOSTCODE'
          },
          $locals: false
        }
        //Test.fill(doc)
        expect(Test.surname).to.equal(doc._doc.surname)
        expect(Test.forename).to.equal(doc._doc.forename)
        expect(Test.age).to.equal(doc._doc.age)
        //Test.empty()
        expect(Test.surname).to.equal(null)
        expect(Test.forename).to.equal(null)
        expect(Test.age).to.equal(null)
      })

    })

  })

})