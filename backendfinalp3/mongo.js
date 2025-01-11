// Import the mongoose library which helps use work with MongoDB
const mongoose = require('mongoose')

// Check if the environment variable MONGODB_URI is defined
require('dotenv').config()


// Check if there are enough command line arguments (at least 3)
// process.argv is an array containing command line arguments
// process.argv[0] is node executable path
// process.argv[1] is script path
// process.argv[2] would be the first actual argument (password in this case)
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1) // Exit process with error code 1
}

// Store the password from command line argument that we enter (node mongo.js 123Monkey in this case)
// into a variable

// Create the MongoDB connection URL string
// This includes username, password, cluster address, database name (noteApp)
// and various connection options
const url = process.env.MONGODB_URI

// Configure mongoose to be less strict about queries
// This prevents some deprecation warnings
mongoose.set('strictQuery',false)

// Establish connection to MongoDB using the connection URL
// This returns a promise that resolves when connection is successful
mongoose.connect(url)


// These lines are for defining the schema of the note object.
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
//// This line creates a model called 'Note' based on the noteSchema we defined
// mongoose.model() is like creating a blueprint for our database documents
// - 'Note' (first argument) is the name of our model - Mongoose will automatically create a collection called 'notes' (lowercase and plural)
// - noteSchema (second argument) defines the structure that all Note documents must follow
// The resulting 'Note' model gives us methods to:
// - Create new notes
// - Search for notes (we use the find method down below)
// - Update notes
// - Delete notes
const Note = mongoose.model('Note', noteSchema)


// These lines save the object to the database
// When the object is saved to the database, the event handler provided to "then" gets called.
// The event handler closes the database connection with the .close() method.
note.save().then(result => {
  console.log('note saved!')
})

note2.save().then(result => {
    console.log('note saved!')
})

note3.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
})*/

// If we comment out the code for adding new notes, they will persist in the database if we previously added them.
// Now we can run this code and them all printed to the console. (The VS code console, not the browser console.)
// The objects are retrieved from the database with the find method of the Note model. The parameter is an object
// that specifies the criteria for finding the notes. Since it is an empty object {}, all notes are returned.
// We could restrict our search to only important notes like this: Note.find({ important: true }).then(result => {
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})


