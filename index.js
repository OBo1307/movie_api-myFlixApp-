// Import express, express-validator, morgan, bodyParser, uuid and built in node modules fs and path
const express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	uuid = require('uuid'),
	fs = require('fs'),
	path = require('path');
const { check, validationResult } = require('express-validator');
const { error } = require('console');

const app = express();

// Integrating Mongoose
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//allows Mongoose to connect to MongoDB database local
/* mongoose.connect('mongodb://127.0.0.1:27017/mfDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}); */

//allows Mongoose to connect to database via MongoDB Atlas
mongoose.connect(process.env.CONNECTION_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//CORS module and Origins
const cors = require('cors');
let allowedOrigins = [
	'http://localhost:8080',
	'https://boflixapp.herokuapp.com',
	'https://boflixapplication.netlify.app',
	'http://localhost:1234',
	'http://localhost:4200',
	'https://bomyflix-angular.netlify.app'
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				// If a specific origin isn't found on the list of allowed origins
				let message =
					"The CORS policy for this application doesn't allow access form origin " +
					origin;
				return callback(new Error(message), false);
			}
			return callback(null, true);
		},
	})
);

// bodyParser middleware functions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import 'auth.js' file
let auth = require('./auth.js')(app);

// Import Passport module and 'passport.js' file
const passport = require('passport');
require('./passport.js');

// GET(READ) requests
app.get('/', (req, res) => {
	res.send('Welcome to myFlix!');
});

// GET with Mongoose and JWT authentication. Data about all the movies
app.get(
	'/movies',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.find()
			.then((movies) => {
				res.status(200).json(movies);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// GET with Mongoose and JWT authentication. movies by Title
app.get(
	'/movies/:Title',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ Title: req.params.Title })
			.then((movie) => {
				res.json(movie);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// GET with Mongoose and JWT authentication. data about a genre
app.get(
	'/movies/genre/:GenreName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Genre.Name': req.params.GenreName })
			.then((movie) => {
				res.json(movie.Genre);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// GET with Mongoose and JWT authentication. data about a director
app.get(
	'/movies/directors/:DirectorName',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Movies.findOne({ 'Director.Name': req.params.DirectorName })
			.then((movie) => {
				res.json(movie.Director);
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// GET with Mongoose and JWT authentication. all the users
app.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.find()
			.then(function (users) {
				res.status(201).json(users);
			})
			.catch(function (err) {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// POST(CREATE) with Mongoose and Validation logic. Allow new users to register
app.post(
	'/users',
	// Validation logic here for request
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required.').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	(req, res) => {
		// check the validation object for errors
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOne({ Username: req.body.Username })
			.then((user) => {
				if (user) {
					return res.status(400).send(req.body.Username + 'already exists');
				} else {
					Users.create({
						Username: req.body.Username,
						Password: hashedPassword,
						Email: req.body.Email,
						Birthday: req.body.Birthday,
					})
						.then((user) => {
							res.status(201).json(user);
						})
						.catch((error) => {
							console.error(error);
							res.status(500).send('Error: ' + error);
						});
				}
			})
			.catch((error) => {
				console.error(error);
				res.status(500).send('Error: ' + error);
			});
	}
);

// PUT(UPDATE) with Mongoose, JWT authentication and Validation logic. Allow users to update their user info
app.put(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	// Validation logic here for request
	[
		check('Username', 'Username is required').isLength({ min: 5 }),
		check(
			'Username',
			'Username contains non alphanumeric characters - not allowed.'
		).isAlphanumeric(),
		check('Password', 'Password is required.').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail(),
	],
	(req, res) => {
		// check the validation object for errors
		let errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		let hashedPassword = Users.hashPassword(req.body.Password);
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{
				$set: {
					Username: req.body.Username,
					Password: hashedPassword,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				},
			},
			{ new: true }, // This line makes sure that the updated document is returned
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send('Error: ' + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);

// POST(CREATE) with Mongoose and JWT authentication. Allow users to add a movie to their list of favorites
app.post(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{ $push: { FavoriteMovies: req.params.MovieID } },
			{ new: true }, // This line makes sure that the updated document is returned
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send('Error: ' + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);

// DELETE with Mongoose and JWT authentication. Allow users to remove a movie from their list of favorites
app.delete(
	'/users/:Username/movies/:MovieID',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndUpdate(
			{ Username: req.params.Username },
			{ $pull: { FavoriteMovies: req.params.MovieID } },
			{ new: true },
			(err, updatedUser) => {
				if (err) {
					console.error(err);
					res.status(500).send('Error: ' + err);
				} else {
					res.json(updatedUser);
				}
			}
		);
	}
);

// DELETE with Mongoose and JWT authentication. Allow existing users to deregister
app.delete(
	'/users/:Username',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		Users.findOneAndRemove({ UserName: req.params.Username })
			.then((user) => {
				if (!user) {
					res.status(400).send(req.params.Username + ' was not found');
				} else {
					res.status(200).send(req.params.Username + ' was deleted.');
				}
			})
			.catch((err) => {
				console.error(err);
				res.status(500).send('Error: ' + err);
			});
	}
);

// express.static to serve "public" folder
app.use(express.static('public'));

// create a write stream (in append mode)
// a "log.txt" file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
	flags: 'a',
});

// setup the logger
app.use(morgan('common', { stream: accessLogStream }));

// "Error-Handling" middleware functions
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Listening on Port ' + port);
});
