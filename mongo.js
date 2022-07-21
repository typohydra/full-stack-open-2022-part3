const mongoose = require('mongoose')

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    `Allowed arguments: 
    node mongo.js <password>
    node mongo.js <password> <name> <number>`
  )
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.asrdc.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)

if (process.argv.length === 5) addPerson()
else displayPeople()

function addPerson() {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then(result => {
      console.log( `added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
}

function displayPeople() {
  Person
  .find({})
  .then(result => {
    console.log('phonebook:')
    result.forEach(person => {console.log(person.name, person.number)})
    mongoose.connection.close()
  })
}