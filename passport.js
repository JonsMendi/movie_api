//In this file we will configure the Passport 'strategies'. They are blocks of code to enable certain means of authentication and authorization multiple times throughout the application. Strategies can range from basic HTTP authentication to JWT-based authentication and third party OAuth with specific providers such as Facebook and Google.
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

//1st Strategy - defines the basic HTTP authentication for login requests.
passport.use(new LocalStrategy({
    usernameField: 'Username',//takes a username and password from the request body and uses Mongoose to check your database for a user with the same username.
    passwordField: 'Password'
}, (username, password, callback) => {
    Users.findOne({ Username: username}, (error, user) => {//If there’s a match, the callback function will be executed (this will be the login endpoint).
        if (error) {
            //console.log(error);
            return callback(error);
        }

        if (!user) {
            //console.log('incorrect username sister!');
            return callback(null, false, {message: 'Incorrect username or password.'});
        }
        //Under, hash any password entered by the user when logging in before comparing it to the password stored in MongoDB.
        if (!user.validatePassword(password)) {
            //console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'});
        }

        //console.log('finished');
        return callback(null, user);
    });
}));

//2st Strategy - it allows to authenticate users based on the JWT submitted alongside their request.
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),//JWT is extracted from the header of the HTTP request. This JWT is called the “bearer token”.
    secretOrKey: 'your_jwt_secret'//A “secret” key to verify the signature of the JWT. this signature verifies that the sender of the JWT (the client) is who it says it is—and also that the JWT hasn’t been altered.
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));
