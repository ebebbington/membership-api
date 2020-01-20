import BaseModel from './BaseModel'
import {Document, Schema, Model, model } from 'mongoose'
const MongooseModel = require('../schemas/CardSchema')

class CardModel extends BaseModel {

    public _id: string|null = null

    public employee_id: number|null = null

    public name: string|null = null

    public email: string|null = null

    public phone_number: string|null = null

    public pin: number|null = null

    public amount: number|null = null

    protected tablename: string = 'Card'

    protected exposables: string[] = [
        '_id',
        'employee_id',
        'name',
        'email',
        'phone_number',
        'pin',
        'amount'
    ]

    protected getMongooseModel(): Model<any>{
        return MongooseModel
    }
}

module.exports = CardModel
