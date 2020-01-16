import mongoose from 'mongoose'
import {Document, Schema, Model, model } from 'mongoose'

export default abstract class BaseModel {

    protected abstract exposables: string[]

    protected abstract tablename: string

    protected abstract getMongooseModel (): Model<any>

    private generateObjectId (id: string): mongoose.Types.ObjectId|boolean {
        return false
    }

    private stripNonExposableProperties (document: any = {}): object {
        return {}
    }

    private fill (dbDocument: {$__: any, isNew: any, errors: any, _doc: object, $locals: any}): void {

    }

    private empty (): void {

    }

    protected async update (query: { [key: string]: any } = {}, data: { [key: string]: any }): Promise<Document|boolean> {
        return false
    }

    protected async create (data: { [key: string]: any }): Promise<any> {
        return false
    }

    protected async find (query?: { [key: string]: any }, limiter: number = 1, sortable: object = {}): Promise<boolean|Array<object>> {
        return false
    }

    protected async delete (query: { [key: string]: any } = {}, deleteMany: boolean = false): Promise<boolean> {
        return false
    }
}
