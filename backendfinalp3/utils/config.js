/* The handling of environment variables is extracted into a separate utils/config.js file: */

// IT IS IMPORTANT THAT dotenv is imported before the "note" model
// is imported. This ensures that the environment variables from
// the .env file are loaded before the model is used.
require('dotenv').config()

const PORT = process.env.PORT


const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI


/* The other parts of the application can access the environment variables by importing the configuration module*/
module.exports = {
  MONGODB_URI,
  PORT
}