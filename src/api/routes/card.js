const express = require('express')
const app = express()
const CardController = require('../controllers/CardController')

/**
 * @example 127.0.0.1:9002/api/v1/card
 */
app.route('/')
  .post(CardController.Create)

/**
 * @example 127.0.0.1:9002/api/v1/card/topup
 */
app.route('/topup')
  .put(CardController.Topup)

module.exports = app