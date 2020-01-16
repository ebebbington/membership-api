const CardModel = require('../models/CardModel')
import { IData } from '../interfaces/controllers/DataInterface'
import express from 'express'

class CardController {

    public static Topup (req: express.Request, res: express.Response, next: Function) {
        console.log('[CardController - Topup]')
    }

    public static Create (req: express.Request, res: express.Response, next: Function) {
        console.log('[CardController - Create]')
    }
}

module.exports = CardController