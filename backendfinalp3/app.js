const config = require('./utils/config')
// Import the Express library, a minimal and flexible web application framework for Node.js
// Express simplifies the creation of server-side logic, such as handling HTTP requests and defining APIs.
const express = require('express')
// This will automatically catch errors in async functions and pass them to the error handler middleware.
// This eliminates the need for manual error handling and simplifies error handling in asynchronous code.
// So we do not need to use try/catch blocks in our route handlers.
// We also do not need to use the next function to pass errors to the error handler middleware,
// as the error handling middleware will automatically catch and handle them.
require('express-async-errors')
// Create an instance of an Express application
// `app` represents the server application that will handle incoming HTTP requests and send responses.
// This instance provides methods for defining routes, applying middleware, and starting the server.
const app = express()
// Middleware that allows us to accept requests from ALL origins
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
// Middleware for whenever Express gets an HTTP GET request it will first
// check if the "dist" directory contains a file corresponding to the request's address.
// If a file is found, Express will return it.
app.use(express.static('dist'))
// Middleware is used to process requests before they reach the defined route handlers.
// Here, `express.json()` is a built-in middleware function that parses incoming requests with JSON payloads.
// It extracts the JSON data from the request body and makes it accessible in `req.body` in route handlers.
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app