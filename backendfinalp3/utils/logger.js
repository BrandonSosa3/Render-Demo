/*So far we have been using console.log and console.error
 to print different information from the code. However,
 this is not a very good way to do things. Let's separate
 all printing to the console to its own module utils/logger.js:
 */

// Function for printing normal console log messages
// We do not print to the console in test mode
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test'){
    console.log(...params)
  }
}

// Function for printing error messages to the console
// We do not print to the console in test mode
const error = (...params) => {
  if (process.env.NODE_ENV !== 'test'){
    console.error(...params)
  }
  console.error(...params)
}

/*This is one of two ways to export:
In this case the file exports an object that has two fields, both are the
functions we defined above. These can be used in two different ways. We use
this version of exporting when we want to export many of the functions in the file.
(See notes.js for other way to export.)

1. Is to require the whole object and refer to functions through the object
using dot notation: const logger = require('./utils/logger')
logger.info('message')
logger.error('error message')

2. Destructure the functions to their own variables in the require statement
const {info, error} = require('/utils/logger')
info('message')
error('error message')*/
module.exports = {
  info, error
}