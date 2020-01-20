const CardModel = require('../models/CardModel')
import { IData } from '../interfaces/controllers/DataInterface'
import express from 'express'

class CardController {

    public static async Topup (req: express.Request, res: express.Response, next: Function) {
        console.log('[CardController - Topup]')
        // Get data
        const body: {
            employee_id: number,
            pin: number,
            amount: number
        } = req.body
        console.log(body)
        // Validate
        if (!body.pin || !body.amount || !parseInt(String(body.pin))) {
            const data: IData = {
                success: false,
                message: 'Your PIN and amount to topup must both be provided',
                statusCode: 400
            }
            return res.status(data.statusCode).json(data)
        }
        // check if the card exists with that pin
        const Card = new CardModel
        console.log(Card)
        const result: any = await Card.find({pin: body.pin, employee_id: body.employee_id}, 1)
        console.log(result)
        if (!result) {
            const data: IData = {
                success: false,
                message: "That card doesn\'t exist, Please register it.",
                statusCode: 404,
                data: ['POST', '127.0.0.1:9002/api/v1/card']
            }
            return res.status(data.statusCode).json(data)
        }
        // update the amount
        const oldDocument = await Card.update({pin: body.pin, employee_id: body.employee_id}, {amount: Card.amount + body.amount })
        if (oldDocument) {
            const data: IData = {
                success: true,
                message: 'Successfully topped up your card',
                data: Card.amount,
                statusCode: 200
            }
            return res.status(data.statusCode).json(data)
        } else {
            const data: IData = {
                success: false,
                message: 'Failed to update your card',
                statusCode: 500
            }
            return res.status(data.statusCode).json(data)
        }
    }

    public static async Create (req: express.Request, res: express.Response, next: Function) {
        console.log('[CardController - Create]')
        // get data
        const newCard: {
            employee_id: number
            name: string,
            email: string,
            phone_number: string,
            pin: number
        } = req.body
        console.log(newCard)
        // validate
        const validated = CardController.validateNewCard(newCard)
        if (!validated.success) {
            const data: IData = {
                success: false,
                message: validated.message,
                statusCode: 400
            }
            return res.status(data.statusCode).json(data)
        }
        // check if it already exists
        const Card = new CardModel
        const result = await Card.find({pin: newCard.pin, employee_id: newCard.employee_id}, 1)
        if (result) {
            const data: IData = {
                success: true,
                message: `Welcome ${Card.name}`,
                statusCode: 200
            }
            return res.status(data.statusCode).json(data)
        }
        // create new entry
        const error = await Card.create(newCard)
        if (error) {
            const fieldName: string = Object.keys(error.errors)[0]
            const errorMessage: string = error.errors[fieldName].message
            const data: IData = {
                success: false,
                message: errorMessage,
                statusCode: 400,
                data: fieldName
            }
            return res.status(data.statusCode).json(data)
        } else {
            const data: IData = {
                success: true,
                message: 'Successfully created your card',
                statusCode: 200
            }
            return res.status(data.statusCode).json(data)
        }
    }

    private static validateNewCard (cardData: any): {success: boolean, message: string} {
        if (!cardData.employee_id) return {success: false, message: 'You must provide your employee ID'}
        if (!cardData.name) return {success: false, message: 'You must provide your name'}
        if (!cardData.email) return {success: false, message: 'Your email must be provided'}
        if (!cardData.phone_number) return {success: false, message: 'Your phone number must be provided'}
        if (!cardData.pin) return {success: false, message: 'You must provide a PIN'}
        if (cardData.pin < 4 || !parseInt(cardData.pin)) return {success: false, message: 'Your PIN must be at least 4 digits'}
        return {success: true, message: 'Passed validation'}
    }
}

module.exports = CardController