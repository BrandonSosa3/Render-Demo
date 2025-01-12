/* This code defines the structure and behavior of a "Note" in a MongoDB database 
The code creates a blueprint (schema) for what every note in the database should look like.*/

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
// This code is responsible for how user data gets converted to JSON when sending it back in API responses
// The code sets up a special transformation rule using toJSON that automatically runs whenever a user
// object needs to be converted to JSON format. It takes two inputs: the original document (which contains
// all the user data from the database) and a returnedObject (which will be the final JSON output).
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // It creates a new id field by converting the MongoDB _id field to a string format that's easier to work with
    returnedObject.id = returnedObject._id.toString()
    // It removes the original _id field since we now have the cleaner id version
    delete returnedObject._id
    // It removes the __v field (a MongoDB version field that users don't need to see)
    delete returnedObject.__v
  }
})

// This line exports this note template so other parts of the application can use it
// to create, read, update, or delete notes while ensuring they following the defined structure.
module.exports = mongoose.model('Note', noteSchema)