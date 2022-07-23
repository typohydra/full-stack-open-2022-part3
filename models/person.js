const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters'],
    required: [true, 'Name is required']
  },
  number: {
    type: String,
    minLength: [9, 'Number nust be at least 8 digits'], // 9 chars including - 
    validate: [
      (n) => (/^\d{2,3}-\d+$/.test(n)),
      `Not a valid phone number format`
    ],
    required: [true, 'Number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
