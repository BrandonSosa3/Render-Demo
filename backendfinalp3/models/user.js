/*In this file we are creating models to be used elsewhere*/

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true

  },
  name: String,
  passwordHash: String,
  // The ids of the notes are stored within the user document as an array of Mongo Ids
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

// This code is responsible for how user data gets converted to JSON when sending it back in API responses
// The code sets up a special transformation rule using toJSON that automatically runs whenever a user
// object needs to be converted to JSON format. It takes two inputs: the original document (which contains
// all the user data from the database) and a returnedObject (which will be the final JSON output).
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // It creates a new id field by converting the MongoDB _id field to a string format that's easier to work with
    returnedObject.id = returnedObject._id.toString()
    // It removes the original _id field since we now have the cleaner id version
    delete returnedObject._id
    // It removes the __v field (a MongoDB version field that users don't need to see)
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// Here we create a User model using this schema and making it available for export to be used in other parts of the application


module.exports = mongoose.model('User', userSchema)