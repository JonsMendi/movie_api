const express = require('express'),
    morgan = require('morgan'), //Morgan is an dependence that register any movements in the URL's by the users. Morgan register and keep the info.
    bodyParser = require('body-parser'),//Bodyparser transforms the data insert by the user to be transformed in JSON. Like these the input from the user will be valid/processed by the server until the Data Base.
    uuid = require('uuid'),//uuid generated automatically a new id to a profile.
    mongoose = require('mongoose'),//mongoose(models.js) is a object modeling tool. It translate the code and its representation (through defining a Schema) from MongoDB to Node.js.
    cors = require('cors'), //Cors is a Cross-Origin Resource Sharing. He extend HTTP requests, giving them new headers that include their domain. The receiving server can then identify where the request is coming from and allow or disallow the request from going through.
    Models = require('./models.js'),
    dotenv = require('dotenv').config();//dotenv is a module that generates Environments Variables through a .env file. Creating variables with private values.
const { update } = require('lodash');//A modern JavaScript utility library delivering modularity, performance & extras.
const app = express();
const Movies = Models.Movie;
const Users = Models.User;
const Actors = Models.Actor;
const { check, validationResult } = require('express-validator');//Package for Server-side Validation security. Will be added in each needed endpoint.

//Under the connections access to the DataBase. At the moment is connected to MongoDB Atlas (Live). The commented under is the local location.
//mongoose.connect('mongodb://localhost:27017/myMoviesDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Under to define who can have access to the API.
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234/'];
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));

//Under is the 'auth.js' file that contains the Login Authentication, requesting using basic HTTP authentication and generate a JWT for the user.
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');//this file we will configure the Passport 'strategies'.

//Under Express Static allows to send automatically to the user files(static, is this case 'documentation.html') that are inside of a folder('public')
app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to myMovies!');
});

//UNDER start the ENDPOINTS

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
app.post('/users', [//Under 'checks' for Validation logic for the request.
    check('Username', 'Username is required.').not().isEmpty(),
    check('Username', 'Username should have at least 5 characters.').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Password', 'Password should have at least 5 characters.').isLength({min: 5}),
    check('Email', 'Email does not appear to be valid.').isEmail()
], (req, res) => {
    //Under checks the validation object for errors.
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //Under, 'hashedPassword' creating variable that imports the bcrypt that 'hashes' the password.
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })// Search to see if a user with the requested username already exists
        .then((user) => {
            if (user) {//If the user is found, send a response that it already exists
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,//using the hashedPassword variable to hash the password.
                        Email: req.body.Email,
                        Birth: req.body.Birth
                    })
                    .then((user) => {res.status(201).json({
                        Username: req.body.Username,
                        id: user.id,
                        Email: req.body.Email,
                        Birth: req.body.Birth
                    })})
                    .catch((error) => {
                        console.log(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//UPDATE 'CRUD' (Update a User field)
app.put('/users/:Username', [//Under 'checks' for Validation logic for the request.
    check('Username', 'Username is required.').not().isEmpty(),
    check('Username', 'Username should have at least 5 characters.').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Password', 'Password should have at least 5 characters.').isLength({min: 5}),
    check('Email', 'Email does not appear to be valid.').isEmail()
], passport.authenticate('jwt', { session: false}), (req, res) => {
    //Under checks the validation object for errors.
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
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
app.get('/movies', /*passport.authenticate('jwt', { session: false}),*/ (req, res) => {
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
app.get('/genres/:GenreName', passport.authenticate('jwt', { session: false}), (req, res) => {
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
    Actors.findOne({ Name: req.params.ActorName})
        .then((actor) => {
            res.json(actor);
        })
        .catch((actor) => {
            console.error(err);
            res.status(500).send('Error :' + err);
        });
});

//HERE finish the ENDPOINTS

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is wrong sister!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});