// server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = process.env.PORT || 3001; 

app.use(cors()); 

// MongoDB connection 
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'index'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// API endpoint to fetch data for all countries (all fields)
app.get('/api/countries', async (req, res) => {
    try {
        const allCountriesData = await mongoose.connection.collection('Report').find({}).toArray(); 
        res.json(allCountriesData); 
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

// API endpoint to fetch data for a single country (all fields)
app.get('/api/countries/:countryName', async (req, res) => {
    try {
        const countryName = req.params.countryName;
        const countryData = await mongoose.connection.collection('Report').findOne({ "Country name": countryName });
        if (!countryData) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.json(countryData);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
});

app.use(express.static('Frontend')); 

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});