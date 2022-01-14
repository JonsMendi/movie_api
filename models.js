const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');//this module will be imported for 'Hashing' the password.

//Movies collection Schema
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

//User collection Schema
let userSchema =  mongoose.Schema({
    Username: { type: String, required: true},
    Password: { type: String, required: true},
    Email: { type: String, required: true},
    Birth: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

//Under bcrypt for Hashing
userSchema.statics.hashPassword = (password) => { return bcrypt.hashSync(password, 10);}//this is called on index.js in the endpoint POST where Users can create a profile.
userSchema.methods.validatePassword = function (password) { return bcrypt.compareSync(password, this.Password);};//this is called on passport.js in LocalStrategies to validate the password comparing with the one bcrypt when creating the password.

//Actors collection Schema
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