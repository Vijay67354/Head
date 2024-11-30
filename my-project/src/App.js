import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PersonInfo() {
  const [persons, setPersons] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [number, setNumber] = useState('');

  // Fetch persons from the backend (MongoDB) on component mount
  useEffect(() => {
    axios.get('/api/persons')
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the persons!", error);
      });
  }, []);

  // Add new person to MongoDB via POST request
  const addPerson = async (e) => {
    e.preventDefault();
    const newPerson = { name, age, number };

    try {
      // Send POST request to add the person to MongoDB
      const response = await axios.post('/api/persons', newPerson);
      // Update the persons state with the new person
      setPersons([...persons, response.data]);

      // Clear the form input fields
      setName('');
      setAge('');
      setNumber('');
    } catch (error) {
      console.error("There was an error adding the person!", error);
    }
  };

  return (
    <div>
      <h1>Person Information</h1>

      {/* Form to add new person */}
      <form onSubmit={addPerson}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <input 
          type="number" 
          placeholder="Age" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Phone Number" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
        />
        <button type="submit">Add Person</button>
      </form>

      {/* List of persons */}
      <div>
        {persons.map((person) => (
          <div key={person._id}>
            <p><strong>Name:</strong> {person.name}</p>
            <p><strong>Age:</strong> {person.age}</p>
            <p><strong>Number:</strong> {person.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonInfo;
