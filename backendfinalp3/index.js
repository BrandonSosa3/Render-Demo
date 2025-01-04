// IT IS IMPORTANT THAT dotenv is imported before the "note" model
// is imported. This ensures that the environment variables from 
// the .env file are loaded before the model is used.
require('dotenv').config()

// Import the Express library, a minimal and flexible web application framework for Node.js
// Express simplifies the creation of server-side logic, such as handling HTTP requests and defining APIs.
const express = require('express')

// Create an instance of an Express application
// `app` represents the server application that will handle incoming HTTP requests and send responses.
// This instance provides methods for defining routes, applying middleware, and starting the server.
const app = express()

// Import the Note model from the note.js file
const Note = require('./models/note')

// Middleware that allows us to accept requests from ALL origins
const cors = require('cors')
app.use(cors())

// Middleware for whenever Express gets an HTTP GET request it will first
// check if the "dist" directory contains a file corresponding to the request's address.
// If a file is found, Express will return it. 
app.use(express.static('dist'))


// This array is a stand-in for a database and stores note objects. 
// In a real-world application, this data would typically be stored in a database 
// (e.g., MongoDB, MySQL, or PostgreSQL).
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// Middleware is used to process requests before they reach the defined route handlers.
// Here, `express.json()` is a built-in middleware function that parses incoming requests with JSON payloads.
// It extracts the JSON data from the request body and makes it accessible in `req.body` in route handlers.
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

// This defines a GET route for the root URL ('/').
// This route is typically used to send a basic response, often for testing or debugging purposes.
// This would not typically be used in a production application.
// Here, it responds with a simple HTML message.
//`request`: Represents the HTTP request made to the server. Contains information like headers, query parameters, and body (if any).
//`response`: Represents the HTTP response that the server sends back to the client.
app.get('/', (request, response) => {
  // Sends an HTML response with the message "Hello World!"
  response.send('<h1>This Server is Fire and Gang</h1>')
})

// This defines a GET route for the '/api/notes' URL.
// response.json(notes) Sends the notes array as a JSON response. 
// The request parameter represents the HTTP request object that contains all
// the data about the request (like the URL, body, headers, etc.), 
// and response is the object used to send back the server's response.
/*This is the way it was done before we started using MongoDB
app.get('/api/notes', (request, response) => {
  response.json(notes)
})*/

// This defines a GET route for the '/api/notes' URL using mongoDB
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})


// Function to generate a unique ID for a new note.
const generateId = () => {
  // Finds the maximum ID in the notes array.
  const maxId = notes.length > 0
  // If it is true, then it returns the maximum ID plus 1.
  // This maps over the notes array, and extracts the id from each note. The spread
  // operator (...) is used to spread the ids into an array. Then the Math.max function
  // then finds the maximum value in this array.
    ? Math.max(...notes.map(n => n.id))
    // If it is false, then it sets the variable equal to 0.
    // where in the next line it will return 0 +1 so it has id: 1
    : 0
  // This returns the maximum ID plus 1.
  return maxId + 1
}

// This defines a POST route for the '/api/notes' URL.
// This allows clients to add new notes to the backend. 
// The request body must include a content field
// If important is not provided, it defaults to false.
// The request parameter represents the HTTP request object that contains all
// the data about the request (like the URL, body, headers, etc.), 
// and response is the object used to send back the server's response.
/* This is the way it was done before we started using MongoDB
app.post('/api/notes', (request, response) => {
  // Extracts the JSON data from the request body.
  const body = request.body
  // If the content field is missing, 
  // the server responds with a 400 Bad Request status code and an error message
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  // Creates a new note object.
  const note = {
    // This is the notes content from the request.body
    content: body.content,
    // If the important field is not provided, it defaults to false.
    important: body.important || false,
    // This generates a unique ID for the new note.
    id: generateId(),
  }
  // Adds the new note to the notes array.
  notes = notes.concat(note)
  // Sends the newly created note back as the response. 
  response.json(note)
})
*/

// This defines a POST route for the '/api/notes' URL using mongoDB
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })

    .catch(error => next(error))
})


// This defines a GET route for the '/api/notes/:id' URL.
// The request parameter represents the HTTP request object that contains all
// the data about the request (like the URL, body, headers, etc.), 
// and response is the object used to send back the server's response.
/* This is the way it was done before we started using MongoDB
app.get('/api/notes/:id', (request, response) => {
// This line extracts the id from the URL and converts it to a number.
// If the client sends a request to /api/notes/1, request.params.id will be the string '1'.
  const id = Number(request.params.id)
  // We use find() method to search through the array and returns the first element that satisfies the condition.
  // The callback function note => note.id === id checks whether the id of the current note (note.id) 
  // matches the id we extracted from the URL.
  const note = notes.find(note => note.id === id)
  // this checks if a note was found in the previous step.
  // If a note is found, it sends the note as a JSON response.
  if (note) {
    response.json(note)
  } else {
    console.log('x')
    //This sends a 404 Not Found response to the client if no note was found with the given ID.
    // .end() method is used to end the response process.
    // This tells the client that the request has been processed but there is no content to return.
    response.status(404).end()
  }
})
*/

// This defines a GET route for the '/api/notes/:id' URL using mongoDB
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

// This defines a DELETE route for the '/api/notes/:id' URL.
// This allows clients to delete notes from the backend.
// The request parameter represents the HTTP request object that contains all
// the data about the request (like the URL, body, headers, etc.), 
// and response is the object used to send back the server's response.
/* This is the way it was done before we started using MongoDB
app.delete('/api/notes/:id', (request, response) => {
  // This line extracts the id from the URL and converts it to a number.
  // If the client sends a request to /api/notes/1, request.params.id will be the string '1'.
  const id = Number(request.params.id)
  // The callback function note => note.id !== id checks if the id of the current 
  // note is not equal to the id that was passed in the URL. This ensures that only the notes whose 
  // id does not match the provided id will remain in the notes array.
  // The result is a new array of notes with the note that had the matching ID removed.
  notes = notes.filter(note => note.id !== id)
  // This line sends a 204 No Content response to the client to indicate that the deletion was
  // successful, but there is no additional content to return.
  response.status(204).end()
})*/

// This defines a DELETE route for the '/api/notes/:id' URL using mongoDB
// In both of the "successful" cases of deleting a resource, the backend 
// responds with the status code 204 no content. The two different cases 
// are deleting a note that exists, and deleting a note that does not exist
// in the database. The result callback parameter could be used for checking if 
// a resource was actually deleted, and we could use that information for returning 
// different status codes for the two cases if we deem it necessary. Any exception
// that occurs is passed onto the error handler.
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


// This defines a PUT route for the '/api/notes/:id' URL where we can toggle the importance of a note.
app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, {content, important}, { new: true , runValidators: true, context: 'query' })  
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// This defines a middleware function
// This function will be used for catching requests made to non-existent routes.
// For these requests, the middleware will return an error message in json format. 
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// Defines a constant variable called PORT 
// If the environment variable PORT is set, it uses that value.
// Otherwise, it uses the default value of 3001.
const PORT = process.env.PORT
// This starts the server and listens for incoming requests on the specified port.
app.listen(PORT, () => {
  // This logs a message to the console when the server starts successfully.
  console.log(`Server running on port ${PORT}`)
})