/* note.js:
Defines the schema for Note documents using Mongoose
Specifies required fields:
content (String, required, minimum 5 characters)
important (Boolean)
user (Reference to User model)
Includes custom JSON transformation:
Converts MongoDB _id to id
Removes unnecessary fields (_id, __v)
Creates relationship with User model through ObjectId reference */

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

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)