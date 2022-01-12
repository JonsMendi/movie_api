const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');
const { update } = require('lodash');
const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;

mongoose.connect('mongodb://localhost:27017/myMoviesDB', { useNewUrlParser: true, useUnifiedTopology: true });

//Under Bodyparser transforms the data insert by the user to be transformed in JSON. Like these the input from the user will be valid/processed by the server until the Data Base.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Under is the 'auth.js' file that contains the Login Authentication, requesting using basic HTTP authentication and generate a JWT for the user.
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');//this file we will configure the Passport 'strategies'.
//Under Morgan is an dependence that register any movements in the URL's by the users. Morgan register and keep the info.
app.use(morgan('common'));
//Under Express Static allows to send automatically to the user files(static, is this case 'documentation.html') that are inside of a folder('public')
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Welcome to myMovies!');
});

//READ 'CRUD' (Get all the users)
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.find().then(users => res.json(users));
});

//READ 'CRUD' (Get User by Username)
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error :' + err);
        });
});

//CREATE 'CRUD' (Creates a new User)
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birth: req.body.Birth
                    })
                    .then((user) => {res.status(201).json(user)})
                    .catch((error) => {
                        console.log(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//UPDATE 'CRUD' (Update a User field)
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birth: req.body.Birth
        }
    },
    { new: true },// This statement makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        }); 
});

//UPDATE 'CRUD' (Add movie in User's FavoriteMovies list)
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $addToSet: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.send('The movie was successfully added to your list!');
      }
    });
});

//DELETE 'CRUD' (Remove movie in User's FavoriteMovies list)
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.send('The movie was successfully removed from your list');
      }
    });
});

//DELETE 'CRUD' (Delete User)
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if(!user) {
                res.status(400).send('Sorry, ' + req.params.Username + ' doesn\'t exist...');
            } else {
                res.status(200).send(req.params.Username + ' was successfully deleted...it was good while it lasted!')
            }
        })
        .catch((user) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});

//READ 'CRUD' (Get all movies)
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.find().then(movies => res.json(movies));
});

//READ 'CRUD' (Get movies by Title)
app.get('/movies/:Title', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error :' + err);
        });
});

//READ 'CRUD' (Get Genre details by Genre)
app.get('/genre/:GenreName', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.GenreName })
        .then((movie) => {
            res.json(movie.Genre);
        })
        .catch((movie) => {
            console.log(err);
            res.status(500).send('Error :' + err);
        });
});

//READ 'CRUD' (Get movies by Director)
app.get('/directors/:DirectorName', passport.authenticate('jwt', { session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.DirectorName})
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((movie) => {
            console.error(err);
            res.status(500).send('Error :' + err);
        });
});

//READ 'CRUD'
app.get('/actors', passport.authenticate('jwt', { session: false}), (req, res) => {
    Actors.find().then(movies => res.json(movies));
});

//READ 'CRUD'
app.get('/actors/:ActorName', passport.authenticate('jwt', { session: false}), (req, res) => {
    Actors.findOne({ 'Actor.Name': req.params.ActorName})
        .then((actor) => {
            res.json(actor);
        })
        .catch((actor) => {
            console.error(err);
            res.status(500).send('Error :' + err);
        });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is wrong sister!');
});

app.listen(8080, () => {
    console.log('This app is listening on port 8080 brother.');
});