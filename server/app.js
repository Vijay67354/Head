// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// Initialize app
const app = express();
app.use(express.json()); // Parse incoming JSON requests
const cors = require('cors');
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3014', // Your frontend origin
  methods: ['GET', 'POST'],
  credentials: true,
}));
// MongoDB connection
console.log(process.env.MONGO_URI); // Check if the value is loaded correctly

if (!process.env.MONGO_URI) {
//   console.error('MongoDB URI is not defined!');
  process.exit(1); // Exit the process if the URI is missing
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB successfully!'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// MongoDB schema and model
const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// API routes
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/persons', async (req, res) => {
  const { name, age, number } = req.body;

  const newPerson = new Person({ name, age, number });
  
  try {
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});