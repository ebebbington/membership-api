import mongoose from 'mongoose'
import {Document, Schema, Model, model } from 'mongoose'
const _ = require('lodash')

export default abstract class BaseModel {

    protected abstract exposables: string[]

    protected abstract tablename: string

    protected abstract getMongooseModel (): Model<any>

    private static generateObjectId (id: string): mongoose.Types.ObjectId|boolean {
        try {
            // if the id isnt already an object id, convert it
            return new mongoose.Types.ObjectId(id)
        } catch (err) {
            console.error(`failed to convert ${id} to a mongoose object id`)
            return false
        }
    }

    private stripNonExposableProperties (document: any = {}): object {
        // Loop through the fields to expose
        Object.keys(document).forEach((property: string, value: any) => {
            const allowedToExpose: boolean = this.exposables.includes(property)
            if (!allowedToExpose) {
                delete document[property]
            }
        })
        return document
    }

    private fill (dbDocument: {$__: any, isNew: any, errors: any, _doc: object, $locals: any}): void {
        this.empty()
        const documentData: object = dbDocument._doc
        const strippedDocument: object = this.stripNonExposableProperties(documentData)
        // Loops through the document properties
        Object.keys(strippedDocument).forEach((propName: string, propValue: any) => {
            // If the child class has the property
            if (this.hasOwnProperty(propName)) {
                // Assign it
                // @ts-ignore
                this[propName] = documentData[propName]
            }
        })
    }

    private empty (): void {
        this.exposables.forEach((value: string, index: number) => {
            if (this.hasOwnProperty(value)) {
                // @ts-ignore
                this[value] = null
            }
        })
    }

    public async update (query: { [key: string]: any } = {}, data: { [key: string]: any }): Promise<Document|boolean> {
        let dataToUpdate: { [key: string]: any } = {} // to store fields to update
        // Loop through the key values pairs provided
        Object.keys(data).forEach((propName: string, propVal: any) => {
            // Check the props passed in are in this class
            if (this.hasOwnProperty(propName)) {
                // Check if that prop passed in is different than
                // the existing prop
                //@ts-ignore
                if (this[propName] !== data[propName]) {
                    // Push the data to update!
                    //this[propName] = data[propName]
                    dataToUpdate[propName] = data[propName]
                }
            }
        })
        // Convert the _id to an object id if passed in
        if (query && query._id) {
            query._id = BaseModel.generateObjectId(query._id)
            if (!query._id) {
                return false
            }
        }
        try {
            const options = { upsert: true }
            const MongooseModel = this.getMongooseModel()
            const oldDocument = await MongooseModel.findOneAndUpdate(query, dataToUpdate, options)
            if (Array.isArray(oldDocument) && !oldDocument.length || !oldDocument) {
                return false
            }
            const updatedDocument = await MongooseModel.findOne(data)
            this.fill(updatedDocument)
            return oldDocument
        } catch (err) {
            console.error(err.message)
            return false
        }
    }

    public async create (data: { [key: string]: any }): Promise<any> {
        const MongooseModel = this.getMongooseModel()
        //@ts-ignore
        const document = new MongooseModel(data)
        try {
            await document.save()
            this.fill(document)
            console.info(`[BaseModel - create: filled the model]`)
        } catch (validationError) {
            const fieldName: string = Object.keys(validationError.errors)[0]
            const errorMessage: string = validationError.errors[fieldName].message
            console.error(`Validation error: ${errorMessage}`)
            return validationError
        }
    }

    public async find (query?: { [key: string]: any }, limiter: number = 1, sortable: object = {}): Promise<boolean|Array<object>> {
        // Convert the _id to an object id if passed in
        if (query && query._id) {
            query._id = BaseModel.generateObjectId(query._id)
            if (!query._id) {
                return false
            }
        }
        // If query is empty, set it to an empty object
        if (!query) {
            query = {}
        }
        const MongooseModel = this.getMongooseModel()
        // Find using the query if there is one, limit the results if present, and sort if present as well
        const result = await MongooseModel.find(query).limit(limiter).sort(sortable)
        // check for an empty response
        if (Array.isArray(result) && !result.length || !result) {
            // empty
            return false
        }
        // If it's a single object then fill (check strongly as we are supposed to be returning a document)
        // and if limit isnt defined or equals 1
        //if (result && !result.length && !Array.isArray(result) && typeof result === 'object') {
        if (result && result.length === 1) {
            this.fill(result[0])
            return result
        }
        // If it's an array of documents return them as we can't fill
        if (result.length > 1 && Array.isArray(result)) {
            return result
        }
        // should never reach here
        console.error('[BaseModel - find: Unreachable code is reachable. Data to check is:' + result)
        return false
    }

    public async delete (query: { [key: string]: any } = {}, deleteMany: boolean = false): Promise<boolean> {
        // warn
        if (_.isEmpty(query)) console.warn(`[BaseModel: delete - query param isnt defined. If deleteMany is defined (${deleteMany}) its going to delete all`)
        // convert _id if passed in
        if (query && query._id) {
            query._id = BaseModel.generateObjectId(query._id)
            if (!query._id) {
                return false
            }
        }
        const MongooseModel = this.getMongooseModel()
        // delete a single doucment
        if (!deleteMany) {
            const result = await MongooseModel.deleteOne(query)
            if (result.ok === 1 && result.deletedCount === 1) {
                this.empty()
                return true
            } else {
                return false
            }
        }
        // delete many documents
        if (deleteMany) {
            // and if the query is empty and wipe isnt allowed, don't let them delete EVERYTHING
            if (_.isEmpty(query)) {
                return false
            }
            const result = await MongooseModel.deleteMany(query)
            if (result.ok === 1 && result.deletedCount && result.deletedCount >= 1) {
                this.empty()
                return true
            } else {
                return false
            }
        }
        return false
    }
}
