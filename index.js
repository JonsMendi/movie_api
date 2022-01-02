const express = require('express');
    morgan = require('morgan');

const app = express();

let topMovies = [
    {
        Title: 'Raider\'s of the Lost Ark - Indiana Jones',
        Year: 1981,
        Genre: 'Adventure',
        Director: 'Steven Spielberg',
        Star: 'Harrison Ford'
    },

    {
        Title: 'Schindler\'s List',
        Year: 1993,
        Genre: 'Biography',
        Director: 'Steven Spielberg',
        Star: 'Liam Neeson'
    },

    {
        Title: 'Catch Me If You Can',
        Year: 2002,
        Genre: 'Biography',
        Director: 'Steven Spielberg',
        Star: 'Leonardo DiCaprio'
    },

    {
        Title: 'Empire of the Sun',
        Year: 1987,
        Genre: 'History',
        Director: 'Steven Spielberg',
        Star: 'Christian Bale'
    },

    {
        Title: 'A.I. Artificial Intelligence',
        Year: 2001,
        Genre: 'Sci-Fi',
        Director: 'Steven Spielberg',
        Star: 'Haley Joel Osment'
    },

    {
        Title: 'Jurassic Park',
        Year: 1993,
        Genre: 'Adventure',
        Director: 'Steven Spielberg',
        Star: 'Sam Neill'
    },

    {
        Title: 'War of the Worlds',
        Year: 2005,
        Genre: 'Sci-Fi',
        Director: 'Steven Spielberg',
        Star: 'Tom Cruise'
    },

    {
        Title: 'Saving Private Ryan',
        Year: 1998,
        Genre: 'War',
        Director: 'Steven Spielberg',
        Star: 'Tom Hanks'
    },

    {
        Title: 'Jaws',
        Year: 1975,
        Genre: 'Thriller',
        Director: 'Steven Spielberg',
        Star: 'Roy Schneider'
    },

    {
        Title: 'Close Encounters of the Third Kind',
        Year: 1977,
        Genre: 'Sci-Fi',
        Director: 'Steven Spielberg',
        Star: 'Richard Dreyfuss'
    },
]

app.use(morgan('combined'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to myMovie!');
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is wrong sister!');
});

app.listen(8080, () => {
    console.log('This app is listening on port 8080 brother.');
});