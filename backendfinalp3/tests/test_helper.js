/* This file essentially defines data that can be used easily in tests in the initialNotes array
This file also creates some functions that make formatting of the data being tested more favorable*/

const Note = require('../models/note')
const User = require('../models/user')

// The code defines an array called initialNotes that contains two example notes that can be used consistently across different tests.
// The purpose of this code is to provide a reliable, consistent set of test data that can be used as inputs when testing the application's
// note-handling functionality. By using the same test data across different tests, developers can ensure their tests are consistent and reproducible.
const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

// Generates a unique ID for a note that does not exist in the database already.
// This creates a temporary note, and saves it to get a valid id created by  the database.
// We then delete that note and return only its ID. This gives us an ID that we know is properly
// formatted but does not point to any actual note anymore. 
const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

// First, This function returns all notes in the database as JSON objects which are easier to use in our tests
// it uses Note.find({}) with an empty object {} to fetch ALL notes stored in the database.
// The async/await keywords tell us this is an asynchronous operation - meaning it needs to wait for the
// database to respond before moving forward.
const notesInDb = async () => {
  const notes = await Note.find({})
  // Second, it takes those found notes and transforms them using map().
  // Each note gets converted to JSON format using the toJSON() method.
  // JSON is a standard way to represent data that's easier to work with in JavaScript.
  // The final output is an array containing all the notes from the database, with each note converted to JSON format.
  return notes.map(note => note.toJSON())
}

// This function does the same as above, but for users instead of notes.
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb
}