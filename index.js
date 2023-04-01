// Import express, morgan and built in node modules fs and path
const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

let topMovies = [
    {
        title: 'Gladiator',
        director: 'Ridley Scott'
    },
    {
        title: 'Joker',
        director: 'Todd Philips'
    },    {
        title: 'The Suicide Squad',
        director: 'James Gunn'
    },    {
        title: 'Deadpool',
        director: 'Tim Miller'
    },    {
        title: 'The Wolverine',
        director: 'James Mangold'
    },    {
        title: 'The Call of the Wild',
        director: 'Chris Sanders'
    },    {
        title: 'Hachi',
        director: 'Lasse Hallstrom'
    },    {
        title: 'Up',
        director: 'Pete Docter'
    },    {
        title: 'Wall-E',
        director: 'Andrew Stanton'
    },    {
        title: 'The Incredibles',
        director: 'Brad Bird'
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix App!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// express.static to serve "public" folder
app.use(express.static('public'));

// create a write stream (in append mode)
// a "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

// setup the logger
app.use(morgan('common', {stream: accessLogStream}));

// "Error-Handling" middleware functions
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('My app is listening on port 8080.');
});