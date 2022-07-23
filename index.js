require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body '))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
         <p>${Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
  .findById(req.params.id)
  .then(person => {
    if(person) {res.json(person)}
    else {res.status(404).end()}
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  Person
    .findOne({name: body.name})
    .then(result => {
      if(result) {
        const err = new Error(`${body.name} is already added to phonebook`)
        err.name = 'postExistingUserError'
        throw err
      }
      return;
    })
    .then(() => {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      return person.save()
    })
    .then(savedPerson => {
      return res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person
    .findByIdAndUpdate(
      req.params.id, 
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  } else if (error.name === 'postExistingUserError') {
    return res.status(400).json({error: error.message});
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})