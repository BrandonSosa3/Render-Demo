// This line imports the test and describe functions from Node's built-in test module. The destructuring syntax pulls out just these
// two specific testing utilities.
const { test, describe } = require('node:test')
// Imports Node's built-in assertion module, which provides methods to validate test conditions.
const assert = require('node:assert')
// The .average indicates we're pulling specifically the average property/method.
const average = require('../utils/for_testing').average


// There are a few things to notice about the tests that we just wrote.
// We defined a describe block around the tests that were given the name average
// Describe blocks can be used for grouping tests into logical collections.
// The test output also uses the name of the describe block in the console log output
describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})