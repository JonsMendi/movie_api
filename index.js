const express = require('express');
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const app = express();

let users = [
    {
        id: 1,
        name: "João",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "Pedro",
        favoriteMovies: []
    },
    {
        id: 3,
        name: "Milton",
        favoriteMovies: []
    },
]

let topMovies = [
    {
        Title: 'The Shawshank Redemption',
        Description: 'Two imprisoned men meet over several years, finding solace and eventual redemption through acts of common decency.',
        Year: 1994,
        Genre: 'Drama',
        Director: {
            Name: 'Frank Darabont',
            Bio: 'Three-time Oscar nominee Frank Darabont was born in a refugee camp in 1959 in Montbeliard, France, the son of Hungarian parents who had fled Budapest during the failed 1956 Hungarian revolution. Brought to America as an infant, he settled with his family in Los Angeles and attended Hollywood High School.',
            Birth: 1959,
            Death: 'Alive'
        },
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81GHxM+oaaL._SX600_.jpg',
        Star: 'Tim Robbins'
    },
    {
        Title: 'The Godfather',
        Description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        Year: 1972,
        Genre: 'Crime',
        Director: {
            Name: 'Francis Ford Coppola',
            Bio: 'Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family. His father, Carmine Coppola, was a composer and musician. His mother, Italia Coppola (née Pennino), had been an actress. Francis Ford Coppola graduated with a degree in drama from Hofstra University, and did graduate work at UCLA in filmmaking.',
            Birth: 1939,
            Death: 'Alive'
        },
        ImageUrl: 'https://images-na.ssl-images-amazon.com/images/I/61cqSr5PBxL._SX600_.jpg',
        Star: 'Marlon Brando'
    },
    {
        Title: 'Schindler\'s List',
        Description: 'After witnessing the persecution of Jews in German-occupied Poland during World War II, industrialist Oskar Schindler begins to worry about his Jewish workforce.',
        Year: 1993,
        Genre: 'Drama',
        Director: {
            Name: 'Steven Spielberg',
            Bio: 'One of the most influential personalities in the history of cinema, Steven Spielberg is Hollywood\'s best known director and one of the wealthiest filmmakers in the world. He has an extraordinary number of commercially successful and critically acclaimed credits to his name, either as a director, producer or writer since launching the summer blockbuster with Tubarão (1975), and he has done more to define popular film-making since the mid-1970s than anyone else.',
            Birth: 1946,
            Death: 'Alive'
        },
        ImageUrl: 'https://m.media-amazon.com/images/I/6174SIM32yL._SY679_.jpg',
        Star: 'Liam Neeson'
    },
    {
        Title: 'Pulp Fiction',
        Description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of gangsters intertwine in four stories of violence and redemption.',
        Year: 1994,
        Genre: 'Crime',
        Director: {
            Name: 'Quentin Tarantino',
            Bio: 'Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee. Quentin moved with his mother to Torrance, California, when he was four years old.',
            Birth: 1963,
            Death: 'Alive'
        },
        ImageUrl: 'https://m.media-amazon.com/images/I/51ZXCKS8G8L.jpg',
        Star: 'John Travolta'
    },
    {
        Title: 'Fight Club',
        Description: 'An office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much bigger.',
        Year: 1999,
        Genre: 'Drama',
        Director: {
            Name: 'David Fincher',
            Bio: 'David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley. He subsequently worked at ILM (Industrial Light and Magic) from 1981-1983. Fincher left ILM to direct TV commercials and music videos after signing with N. Lee Lacy in Hollywood.',
            Birth: 1962,
            Death: 'Alive'
        },
        ImageUrl: 'https://m.media-amazon.com/images/I/71V4mbT4n9L._SY679_.jpg',
        Star: 'Brad Pitt'
    },
]

app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to myMovie!');
});

//READ 'CRUD'
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

//CREATE 'CRUD'
app.post('/users', (req, res) => {
    const newUser = req.body;

    if(newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('Sorry, user needs a name!')
    }
});

//UPDATE 'CRUD'
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id );

    if(user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('No name!');
    }
});

//CREATE 'CRUD'
app.post('/users/:id/movies/:movieId', (req, res) => {
    const { id, movieId } = req.params;

    let user = users.find( user => user.id == id );

    if(user) {
        user.favoriteMovies.push(movieId);
        res.status(200).send(`The ${movieId} as been added to the profile`);
    } else {
        res.status(400).send('No movie with such name!');
    }
});

//DELETE 'CRUD'
app.delete('/users/:id/movies/:movieId', (req, res) => {
    const { id, movieId } = req.params;

    let user = users.find( user => user.id == id );

    if(user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieId);
        res.status(200).send(`The ${movieId} as been removed from the profile`);
    } else {
        res.status(400).send('No movie has been removed!');
    }
});

//DELETE 'CRUD'
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id );

    if(user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`The user ${users[0].name} profile has been deleted`);
    } else {
        res.status(400).send('That user do not exist!');
    }
});

//READ 'CRUD'
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
});

//READ 'CRUD'
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find(movies => movies.Title === title);

        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(400).send('That movie is not here sister!')
        }
});

//READ 'CRUD'
app.get('/genre/:genre', (req, res) => {
    const { genre } = req.params;
    const genreName = topMovies.find(movies => movies.Genre === genre).Genre;//Just returning 'Drama' Instead of 'Genre': 'Drama'(Need to fix)

        if (genre) {
            res.status(200).json(genre);
        } else {
            res.status(400).send('That Genre is not here sister!')
        }
});

//READ 'CRUD'
app.get('/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = topMovies.find(movies => movies.Director.Name === directorName).Director;

        if (director) {
            res.status(200).json(director);
        } else {
            res.status(400).send('That Director is not here sister!')
        }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is wrong sister!');
});

app.listen(8088, () => {
    console.log('This app is listening on port 8088 brother.');
});