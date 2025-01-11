const Note = require('../models/note')
const User = require('../models/user')

// Initial notes for testing and sets initial notes in the database in test mode
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

// We also define the nonExistingId function ahead of time,
// which can be used for creating a database object ID that does not belong to any note object in the database.
const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

// Fucnction that returns all notes in the database
const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

// Function that returns all users in the database
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes, nonExistingId, notesInDb, usersInDb
}