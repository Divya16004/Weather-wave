const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Collection = require('./mongodb');

const app = express();
const PORT = 5000;
const API_KEY = "a8309864ebc557e9c1846ef22a29ad10";

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the homepage
app.get('/', async (req, res) => {
    const city = req.query.city || 'London'; // Default city if none provided
    try {
        const weatherData = await getWeatherData(city);
        res.render('index', { weatherData, city, getTempIcon });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.redirect('/error?message=Error fetching weather data');
    }
});

// Route for hourly forecast
app.get('/hourly', async (req, res) => {
    const city = req.query.city || 'London';// Default city if none provided
    try {
        const hourlyData = await getHourlyData(city);
        res.render('hourly', { hourlyData, city, getTempIcon });
    } catch (error) {
        console.error('Error fetching hourly data:', error.message);
        res.redirect('/error?message=Error fetching hourly data');
    }
});

// Route for weekly forecast
app.get('/weekly', async (req, res) => {
    const city = req.query.city || 'London'; // Default city if none provided
    try {
        const weeklyData = await getWeeklyData(city);
        res.render('weekly', { weeklyData, city,  getTempIcon });
    } catch (error) {
        console.error('Error fetching weekly data:', error.message);
        res.redirect('/error?message=Error fetching weekly data');
    }
});

// Route for error page
app.get('/error', (req, res) => {
    const errorMessage = req.query.message || 'An unexpected error occurred.';
    res.status(500).render('error', { errorMessage });
});

// Function to get current weather data
async function getWeatherData(city) {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    return response.data;
}

// Function to get hourly forecast data
async function getHourlyData(city) {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
    return response.data;
}

// Function to get weekly forecast data
async function getWeeklyData(city) {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
    return response.data;
}

// Define the function to get temperature icons based on temperature
function getTempIcon(temp) {
    if (temp >= 30) {
        return '/icons/high-temp.jpg'; // Heroicons class for high temperature
    } else if (temp >= 15) {
        return '/icons/mid-temp.png'; // Heroicons class for mild temperature
    } else {
        return '/icons/low-temp.webp'; // Heroicons class for low temperature
    }
}

// Define the function to get weather icons based on condition
app.get('/signup', (req, res) => {
    res.render('signup', { message: null }); // Pass an empty message to avoid errors
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const user = new Collection(data);
        await user.save(); // Save a single document
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Additional routes for signup, login, and dashboard

app.get('/signup', (req, res) => {
    res.render('signup', { message: null }); // Pass an empty message to avoid errors
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const user = new Collection(data);
        await user.save(); // Save a single document
        res.redirect('/login'); // Redirect to login page after successful signup
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { message: null }); // No flash messages used
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await Collection.findOne({ name, password });
        if (user) {
            // Store the username in the session
            req.session.username = user.name;
            res.redirect('/dashboard'); // Redirect to dashboard after successful login
        } else {
            res.render('login', { message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/login'); // Redirect to login if user is not logged in
    }
    res.render('dashboard', { session: req.session }); // Pass session to dashboard
});
app.get('/aboutus',(req,res)=>{
    res.render('aboutus',{title:'Aboutus - weatherwave'});
});


// Route for agriculture advice
app.get('/advice', (req, res) => {
    res.render('advice'); // Render the advice page
});

app.get('/aboutus',(req,res)=>{
    res.render('aboutus',{title:'Aboutus - weatherwave'});
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
