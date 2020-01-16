// ///////////////////////////////
// Packages
// ///////////////////////////////
import express from 'express'
const mongoose = require('mongoose')
require('dotenv').config()
const bodyParser = require('body-parser')

/**
 * Server
 *
 * The foundation and entry point for the application
 *
 * @author    Edward Bebbington
 *
 * @example   const app = require('app') //express app object
 *
 * @property  {express.Application}     app             - Express app object
 * @property  {string}                  env             - The environment to run in
 * @property  {string}                  dbUrl           - URL of the database to connect to
 *
 * @function  bootstrap                 - Return an start an instance of the class
 * @function  constructor               - Fires events
 * @function  defineRoutes              - Set up the routes
 * @function  configure                 - Configure such as view engine
 * @function  instantiateDbConnection   - Create connection to database
 * @function  initiateDbLogging         - Start listening for events on the database and log them
 *
 * @returns   {ng.auto.IInjectorService} - Returns the newly created injector for this app.
 *
 */
class Server {

    /**
     * Application object
     *
     * @var {express.Application} public
     */
    public app: express.Application;

    /**
     * Environment to run e.g development, staging
     *
     * @var {string} private
     */
    private readonly env: string

    /**
     * Url to use when connecting to the mongoose database
     *
     * @var {string} private
     */
    private readonly dbUrl: string

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // define properties
        this.env = process.env.NODE_ENV || ''
        this.dbUrl = process.env.DB_URL || ''
        //create expressjs application
        this.app = express();
        //configure application
        this.configure();
        // setup routes
        this.defineRoutes()
        // connect to the database
        this.instantiateDbConnection()
        // start db logging
        this.initiateDbLogging()
    }

    /**
     * Configure the node application
     *
     * @class Server
     * @method configure
     * @return {void}
     */
    private configure (): void {
        this.app.use(bodyParser.urlencoded({ extended: false}))
        this.app.use(bodyParser.json())
    }

    /**
     * Set up and define the routes
     *
     * @class Server
     * @method defineRoutes
     * @return {void}
     */
    private defineRoutes (): void {
        const cardRoute = require('./routes/card.js')
        this.app.use('/api/v1/card', cardRoute)
    }

    /**
     * Make the connection to the database
     *
     * @class Server
     * @method instantiateDbConnection
     * @return {void}
     */
    private instantiateDbConnection (): void {
        mongoose.connect(this.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                if (this.env === 'development') {
                    console.info('Database connection has opened')
                }
            })
            .catch((err: any) => {
                console.info('Error when making conn to db')
                console.error(err)
            })
    }

    /**
     * Start logging database actions
     *
     * @class Server
     * @method initiateDblogging
     * @return {void}
     */
    private initiateDbLogging (): void {
        mongoose.connection
            .on('connecting', () => {
                console.info('Connecting to the database')
            })
            .on('connected', () => {
                console.info('Connected to the database')
            })
            .on('close', () => {
                console.info('Closed the connection to the database')
            })
            .on('error', () => {
                console.error('Connection error with the database')
            })
            .on('disconnected', () => {
                console.info('Lost connection with the database')
            })
    }
}

const server = Server.bootstrap()
module.exports = server.app