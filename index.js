// Import express, morgan, bodyParser, uuid and built in node modules fs and path
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    fs = require('fs'),
    path = require('path');

const app = express();

app.use(bodyParser.json());

let topMovies = [
    {
        Title: 'Gladiator',
        Description: 'Commodus takes over power and demotes Maximus, one of the preferred generals of his father, Emperor Marcus Aurelius. As a result, Maximus is relegated to fighting till death as a gladiator.',
        Director: {
            Name: 'Ridley Scott',
            Birth: 1937,
            Bio: 'Sir Ridley Scott is an English film director and producer. Best known for directing films in the science fiction and historical drama genres, his work is known for its atmospheric and highly concentrated visual style.'
        },
        Genre: {
            Name: 'Drama',
            Description: 'The drama genre features stories with high stakes and many conflicts. They\'re plot-driven and demand that every character and scene move the story forward.'
        }
    },
    {
        Title: 'Joker',
        Description: 'Forever alone in a crowd, failed comedian Arthur Fleck seeks connection as he walks the streets of Gotham City. Arthur wears two masks -- the one he paints for his day job as a clown, and the guise he projects in a futile attempt to feel like he\'s part of the world around him.',
        Director: {
            Name: 'Todd Philips',
            Birth: 1970,
            Bio: 'Todd Phillips is an American film director, producer, and screenwriter. He began his career in 1993 and directed films in the 2000s such as Road Trip, Old School, Starsky & Hutch, and School for Scoundrels. He came to wider prominence in the early 2010s for directing The Hangover film series.'
        },
        Genre: {
            Name: 'Thriller',
            Description: 'A thriller is a type of mystery with a few key differences. As its name suggests, thrillers tend to be action-packed and fast-paced with moments full of tension, anxiety, and fear.'
        }
    },    
    {
        Title: 'The Suicide Squad',
        Description: 'The government sends the most dangerous supervillains in the world -- Bloodsport, Peacemaker, King Shark, Harley Quinn and others -- to the remote, enemy-infused island of Corto Maltese. Armed with high-tech weapons, they trek through the dangerous jungle on a search-and-destroy mission, with only Col. Rick Flag on the ground to make them behave.',
        Director: {
            Name: 'James Gunn',
            Birth: 1966,
            Bio: 'James Francis Gunn Jr. is an American filmmaker and executive. He began his career as a screenwriter in the mid-1990s, starting at Troma Entertainment with Tromeo and Juliet.'
        },
        Genre: {
            Name: 'Action',
            Description: 'Movies in the action genre are fast-paced and include a lot of action like fight scenes, chase scenes, and slow-motion shots. They can feature superheroes, martial arts, or exciting stunts. These high-octane films are more about the execution of the plot rather than the plot itself.'
        }
    },    
    {
        Title: 'Deadpool',
        Description: 'Ajax, a twisted scientist, experiments on Wade Wilson, a mercenary, to cure him of cancer and give him healing powers. However, the experiment leaves Wade disfigured and he decides to exact revenge.',
        Director: {
            Name: 'Tim Miller',
            Birth: 1964,
            Bio: 'Timothy Miller is an American filmmaker. He made his feature-film directing debut with Deadpool. He was nominated for the Academy Award for Best Animated Short Film as co-story writer and executive producer of the short animated film Gopher Broke.'
        },
        Genre: {
            Name: 'Fantasy',
            Description: 'By definition, fantasy is a genre that typically features the use of magic or other supernatural phenomena in the plot, setting, or theme. Magical or mythological creatures often feature, as well as races other than humans, such as elves, dwarves, or goblins.'
        }
    },    
    {
        Title: 'The Wolverine',
        Description: 'Logan travels to Tokyo to meet Yashida, an old acquaintance who is dying. The situation regresses when Yashida offers to take away his healing abilities, but Logan refuses.',
        Director: {
            Name: 'James Mangold',
            Birth: 163,
            Bio: 'James Allen Mangold is an American filmmaker. He is best known for the films Cop Land, Girl, Interrupted, Walk the Line, 3:10 to Yuma, The Wolverine and Logan, the last of which earned him a nomination for the Academy Award for Best Adapted Screenplay.'
        },
        Genre: {
            Name: 'Sci-fi',
            Description: 'Science fiction, also often known as \'sci-fi\', is a genre of literature that is imaginative and based around science. It relies heavily on scientific facts, theories, and principles as support for its settings, characters, themes, and plot.'
        }
    },    
    {
        Title: 'The Call of the Wild',
        Description: 'Buck, a giant yet generous dog, feels helpless when he is abducted from his home and transported to the remote Yukon, where Perrault decides to use him for his dog sled mail operations.',
        Director: {
            Name: 'Chris Sanders',
            Birth: 1962,
            Bio: 'Christopher Michael Sanders is an American animator, director, screenwriter, producer, illustrator, and voice actor. His credits include Lilo & Stitch and How to Train Your Dragon, both of which he co-wrote and co-directed with Dean DeBlois, The Croods with Kirk DeMicco, and The Call of the Wild.'
        },
        Genre: {
            Name: 'Family',
            Description: 'Family film is a genre that is contains appropriate content for younger viewers. Family film aims to appeal not only to children, but to a wide range of ages. While the storyline may appeal to a younger audience, there are components of the film that are geared towards adults- such as witty jokes and humor.'
        }
    },    
    {
        Title: 'Hachi',
        Description: 'A professor finds an abandoned dog and takes him home. Over a period of time, he forms an unbreakable bond with the dog.',
        Director: {
            Name: 'Lasse Hallstrom',
            Birth: 1946,
            Bio: 'Lars Sven "Lasse" Hallström is a Swedish film director. He first became known for directing almost all the music videos by the pop group ABBA, and subsequently became a feature film director. He was nominated for an Academy Award for Best Director for My Life as a Dog and later for The Cider House Rules.'
        },
        Genre: {
            Name: 'Drama',
            Description: 'The drama genre features stories with high stakes and many conflicts. They\'re plot-driven and demand that every character and scene move the story forward.'
        }
    },    
    {
        Title: 'Up',
        Description: 'Carl, an old widower, goes off on an adventure in his flying house in search of Paradise Falls, his wife\'s dream destination.',
        Director: {
            Name: 'Pete Docter',
            Birth: 1968,
            Bio: 'Peter Hans Docter is an American animator, film director, screenwriter, producer, voice actor, and chief creative officer of Pixar. He is best known for directing the Pixar animated feature films Monsters, Inc., Up, Inside Out, and Soul, and as a key figure and collaborator at Pixar.'
        },
        Genre: {
            Name: 'Animation',
            Description: 'Animation is a method by which still figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, many animations are made with computer-generated imagery (CGI).'
        }
    },    
    {
        Title: 'Wall-E',
        Description: 'A machine responsible for cleaning a waste-covered Earth meets another robot and falls in love with her. Together, they set out on a journey that will alter the fate of mankind.',
        Director: {
            Name: 'Andrew Stanton',
            Birth: 1965,
            Bio: 'Andrew Ayers Stanton is an American filmmaker and voice actor based at Pixar, which he joined in 1990.'
        },
        Genre: {
            Name: 'Adventure',
            Description: 'The adventure genre consists of books where the protagonist goes on an epic journey, either personally or geographically. Often the protagonist has a mission and faces many obstacles in his way.'
        }
    },    
    {
        Title: 'The Incredibles',
        Description: 'Forced to adopt a civilian identity and stuck in a white-collar job, Mr Incredible itches to get back into action. When he is lured into a trap by the evil Syndrome, his family contrives to save him.',
        Director: {
            Name: 'Brad Bird',
            Birth: 1957,
            Bio: 'Phillip Bradley Bird is an American film director, animator, screenwriter, producer, and voice actor. He has had a career spanning forty years in both animation and live-action. Bird was born in Montana and grew up in Oregon.'
        },
        Genre: {
            Name: 'Animation',
            Description: 'Animation is a method by which still figures are manipulated to appear as moving images. In traditional animation, images are drawn or painted by hand on transparent celluloid sheets to be photographed and exhibited on film. Today, many animations are made with computer-generated imagery (CGI).'
        }
    }
];

let users = [
    {
        Id: 1,
        Name: 'John',
        favoriteMovies: ['Casablanca']
    },
    {
        Id: 2,
        Name: 'Marie',
        favoriteMovies: ['Inception']
    },
    {
        Id: 3,
        Name: 'Nina',
        favoriteMovies: ['It\'s a Wonderful Life']
    }
];

// GET(READ) requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix!');
});

// GET all the movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// GET movies by Title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('We don\'t have that!');
    }

});

// GET data about a genre
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = topMovies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('We don\'t have this genre!');
    }

});

// GET data about a director
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = topMovies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('We don\'t have this director!');
    }

});

// POST(CREATE). Allow new users to register
app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.Name) {
        newUser.Id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('Users need names!');
    }
});

// PUT(UPDATE). Allow users to update their user info (username)
app.put('/users/:Id', (req, res) => {
    const { Id } = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.Id == Id);

    if(user) {
        user.Name = updatedUser.Name;
        res.status(200).json(user);
    } else {
        res.status(400).send('We don\'t have this user!');
    }
});

// POST(CREATE). Allow users to add a movie to their list of favorites
app.post('/users/:Id/:movieTitle', (req, res) => {
    const { Id, movieTitle } = req.params;

    let user = users.find(user => user.Id == Id);

    if(user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has beend added to user ${Id}'s array!`);
    } else {
        res.status(400).send('We don\'t have this user!');
    }
});

// DELETE. Allow users to remove a movie from their list of favorites
app.delete('/users/:Id/:movieTitle', (req, res) => {
    const { Id, movieTitle } = req.params;

    let user = users.find(user => user.Id == Id);

    if(user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title != movieTitle);
        res.status(200).send(`${movieTitle} has beend removed from user ${Id}'s array!`);
    } else {
        res.status(400).send('We don\'t have this user!');
    }
});

// DELETE. Allow existing users to deregister
app.delete('/users/:Id', (req, res) => {
    const { Id } = req.params;

    let user = users.find(user => user.Id == Id);

    if(user) {
        users = users.filter(user => user.Id != Id);
        res.status(200).send(`User ${Id} has been deleted!`);
    } else {
        res.status(400).send('We don\'t have this user!');
    }
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