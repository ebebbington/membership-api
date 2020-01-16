import BaseModel from './BaseModel'
import {Document, Schema, Model, model } from 'mongoose'
//const MongooseModel = require('../schemas/card')

class CardModel extends BaseModel {

    public _id: string|null = null

    public name: string|null = null

    public email: string|null = null

    public phone_number: string|null = null

    public pin: number|null = null

    public amount: number|null = null

    protected tablename: string = 'card'

    protected exposables: string[] = [
        '_id',
        'name',
        'email',
        'phone_number',
        'pin',
        'amount'
    ]

    protected getMongooseModel(): Model<any>{
        // todo :: return below statement when schema is created
        //return MongooseModel
        return Model
    }
}

module.exports = BaseModel
