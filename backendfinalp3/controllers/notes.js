/* The module exports the router to be available for all consumers of the module.
All routes are now defined for the router object, similar to what was done before
with the object representing the entire application.
It's worth noting that the paths in the route handlers have shortened.
In the previous version, we had:  app.delete('/api/notes/:id', (request, response, next) => {
Now we have:  notesRouter.delete('/:id', (request, response, next) => {
So what are these router objects exactly? The router is in fact a middleware,
that can be used for defining "related routes" in a single place, which is typically placed
in its own module. The app.js file that creates the actual application takes the router into use
in the following way: const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

The router we defined earlier is used if the URL of the request starts with /api/notes.
For this reason, the notesRouter object must only define the relative parts of the routes,
i.e. the empty path / or just the parameter /:id.
*/

// This will stores the router object which we can export and use in all of our code
// This object will hold all routes for our notes.
const notesRouter = require('express').Router()
// This imports the Note and User model which defines what a note and user looks like
const Note = require('../models/note')
const User = require('../models/user')

// This is a route handler for getting all notes from the database
// The code uses async/await to handle asynchronous database operations.
// It queries the database using the Note model (which represents notes in the database) with .find({}).
// The empty object {} means it will find all notes without any filtering conditions.
notesRouter.get('/', async (request, response) => {
  const notes = await Note
  // The .populate('user', { username: 1, name: 1 }) part is interesting - it tells the database
  // to also fetch related user information for each note, specifically getting the username and name fields from the associated user records.
  // This is adding the user info to the notes object.
    .find({}).populate('user', { username: 1, name: 1 })
    // For outputs, the handler sends back all the found notes as JSON using response.json(notes).
    // The notes will include both the note data and the populated user information.
  response.json(notes)
})


// The code handles HTTP GET requests to fetch a single note by its ID.
// When someone makes a request to this route (like visiting /notes/123 where 123 is an ID),
// the code takes that ID from the URL parameters as its input.
notesRouter.get('/:id', async (request, response) => {
  // Using this ID, the code searches the database using Note.findById() to find a matching note.
  // The async/await syntax is used here because searching the database takes some time, and we want to wait for the result before continuing.
  const note = await Note.findById(request.params.id)
  // The code then follows two possible paths:
  // If a note is found (note exists), it sends back the note data as JSON to whoever requested it
  // If no note is found (note is null/undefined), it sends back a 404 status code, which means "not found"
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})


notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote)
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

/*This is the second way of exporting and is preferable if only a
small portion of the exported functions are used in a file.
E.g. in this file we only export notesRouter, but not the other functions.

In this case there is only one thing exported so the only way to use it is
const notesRouter = require('./controllers/notes')
app.use('/api/notes', notesRouter)

Now the exported "thing" (in this case a router object) is assigned to a variable and used as such.
*/
module.exports = notesRouter