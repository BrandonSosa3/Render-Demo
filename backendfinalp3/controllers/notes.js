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

const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// Changed this route to async/await so we avoid callback hell
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id
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

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
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