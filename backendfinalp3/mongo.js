/*The mongo.js file is specifically used as a development and testing utility - it's not part of the production application flow.
 While app.js handles the actual database connections in the deployed application, mongo.js serves as a standalone script for developers to:

Test database connectivity
Manually add test data
Verify database operations
Debug database interactions */


const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority`

// configures mongoose to less strrict query behavior
mongoose.set('strictQuery', false)

// Sets up connection to MongoDB database, and defines the structure for storing data in the database (schema)
/*The code first establishes a connection to MongoDB using mongoose.connect(), where 'url' contains the database
 connection address. Once the connection is successful (that's what the .then() part means), it moves on to define
 how our notes should be structured. */
mongoose.connect(url).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })
  // Finally, the code creates a Note model using mongoose.model('Note', noteSchema).
  // The first argument 'Note' is the name we give to this collection of notes in our database.
  const Note = mongoose.model('Note', noteSchema)

  /*
  const note = new Note({
    content: 'HTML is x',
    important: true,
  })

  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  */

  // This code retrieves and displays all notes from the database.
  // The code starts with Note.find({}), which is a database query that searches
  // for all documents in the Note collection. The empty curly braces {} as the search criteria means "find everything"
  // that search returns a Promise which is handled by the .then() method.
  // The code then uses result.forEach() to loop through each note in the result array.
  // For each note it finds, it prints it to the console using console.log(note).
  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    // Finally, after all notes have been printed, the code calls mongoose.connection.close() to properly close the database connection.
    mongoose.connection.close()
  })
})



