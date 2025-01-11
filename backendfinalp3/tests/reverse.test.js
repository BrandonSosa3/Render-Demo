// The library node:test expects by default that the names of test files contain .test.
// In this course, we will follow the convention of naming our tests files with the extension .test.js.

// The test defines the keyword test and the library assert, which is used by
//  the tests to check the results of the functions under test.
const { test } = require('node:test')
const assert = require('node:assert')

// In this row, the test file imports the function to be tested and assigns it to a variable called reverse:
const reverse = require('../utils/for_testing').reverse


// Individual test cases are defined with the test function. The first argument of the function is the test
// description as a string. The second argument is a function, that defines the functionality for the test case.
// The functionality for the second test case looks like this:
// () => {
//const result = reverse('react')
// assert.strictEqual(result, 'tcaer')
//}

//  Test case 1
// In the first two lines we execute the function to be tested and store the result in a variable.
// The third line uses the assert.strictEqual function to check that the result is equal to the expected value.
test('reverse of a', () => {
  const result = reverse('a')

  assert.strictEqual(result, 'a')
})
// Test case 2
test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

// Test case 3
test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})