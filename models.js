const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    ReleaseYear: String,
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}],
        Birth: String,
        Death: String
    },
    ImageUrl: String,
    Actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor'}],
    Rating: String,
    Featured: Boolean
});

let userSchema =  mongoose.Schema({
    Username: { type: String, required: true},
    Password: { type: String, required: true},
    Email: { type: String, required: true},
    Birth: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let actorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: String,
    Movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
    Birth: String,
    Death: String
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Actor = mongoose.model('Actor', actorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Actor = Actor;