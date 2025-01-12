/*Provides utility functions for testing
Contains:
reverse(): String reversal function
average(): Array average calculator
Used for demonstrating testing concepts */

const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}


