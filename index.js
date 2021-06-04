const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const timeStamp = new Date()
    res.send('Phonebook has info for ' + persons.length + ' people <br><br>' + timeStamp)
  })

app.get('/api/persons', (request, response) => {
    response.json(persons)
  })  

app.get('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
const person = persons.find(person => person.id === id)
if (person) {
    response.json(person)
} else {
    response.status(404).end()
}
})  

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        return response.status(400).json({error: 'person name missing'})
    } else {
        if (!person.number) {
            return response.status(400).json({error: 'phone number missing'})
        } else {
            const name = person.name
            if (persons.find(person => person.name === name)) {
                return response.status(400).json({error: 'person name must be unique'})
            }
        }
    }
    
    const id = Math.floor(Math.random() * 1000000);
    person.id = id
    persons = persons.concat(person)
    response.json(person)
})
  
const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)