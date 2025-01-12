/*This file acts as the application's backbone, bringing together all components
and establishing the request processing pipeline. It's crucial for maintaining a
well-structured and maintainable Express application. */

/*The mongo.js file is specifically used as a development and testing utility -
it's not part of the production application flow. While app.js handles the actual
database connections in the deployed application, mongo.js serves as a standalone script for developers to:

Test database connectivity
Manually add test data
Verify database operations
Debug database interactions */

/* we uses require statements to bring in both built-in modules and custom
modules from different files in the project. The main pieces being imported are: */

const config = require('./utils/config')
// Imports Express.js framework and creates a new Express application instance.
const express = require('express')
const app = express()
// Adds support for handling async errors in Express routes without try-catch blocks.
require('express-async-errors')
// Imports CORS middleware to enable cross-origin requests between different domains.
const cors = require('cors')
// Imports route handlers for notes and users from their respective controller files.
// In these files we have defined notesRouter and usersRouter as express.Router() objects.
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
// Imports our custom middleware functions for logging, handling unknown endpoints, and error handling.
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
// Imports the loginRouter from the controllers/login.js file.
const loginRouter = require('./controllers/login')
// Imports mongoose library for interacting with MongoDB databases
const mongoose = require('mongoose')
// Configures mongoose to use less strict query filtering
mongoose.set('strictQuery', false)
// Logs a message using our logger utility when the application connects to our MongoDB database.
logger.info('connecting to', config.MONGODB_URI)

/*establishes a connection to MongoDB (a database) using mongoose.
 When the connection succeeds, it logs a success message; if it fails,
  it logs an error message. This connection allows the app to store and retrieve data. */
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

// Uses the middleware cors to handle requests from different domains
app.use(cors())
// Serves static files from the dist directory
app.use(express.static('dist'))
// Helps the app understand JSON data sent in requests
app.use(express.json())
// Uses the middleware logger to log incoming requests
app.use(middleware.requestLogger)

// This is where we can actually use the router object we created in the controller files
/*here are two main routes:
/api/notes handles all requests related to notes using notesRouter
/api/users handles all requests related to users using usersRouter */
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// It tells Express to use the loginRouter to handle any requests that
// come to the '/api/login' URL path. When users try to log in to the application,
// their requests will be directed to this route, where the loginRouter (defined in controllers/login.js)
// will process the login credentials and authenticate users.
app.use('/api/login', loginRouter)

// Here we make use of our two error handling middleware functions
app.use(middleware.unknownEndpoint) //handles requests to non existent routes
app.use(middleware.errorHandler)    // processes any errors that occur during request handling

// When another file wants to use this configured app (with all its middleware, routes, and
// database connections), they can import it using require(). This is particularly useful for
// separating the app configuration from the actual server startup code.
module.exports = app