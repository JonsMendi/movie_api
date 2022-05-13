//This file contains the 'login' endpoint in order to implement basic HTTP authentication for login requests.
//Because this endpoint is going to implement a special authentication measures for the request, we place here, in a separate file.
//This code will will authenticate login requests using basic HTTP authentication and generate a JWT for the user.
dotenv = require('dotenv').config();
const jwtSecret = process.env.JWTSECRET;// This has to be the same key used in the JWTStrategy.

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport');// Your local passport file.

/**
 * @description Generates a JWT for a user and returns the token as a string
 * @method generateJWTToken
 * @param {object} - user Object containing all of the user's data
 * @returns {string} - JWT for the logged in user
 */

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,// This is the username you’re encoding in the JWT.
        expiresIn: '7d',// This specifies that the token will expire in 7 days.
        algorithm: 'HS256'// This is the algorithm used to “sign” or encode the values of the JWT.
    });
}

/**
 * @description Endpoint to login the user
 * @method POSTLoginUser
 * @param {string} - endpoint - /login
 * @returns {object} - JSON object containing data for the user and a new JWT. 
 * { user: {  
 *   _id: <string>,  
 *   Username: <string>,
 *   Password: <string> (hashed),  
 *   Email: <string>,  
 *   Birth: <date>,  
 *   FavoriteMovies: []  
 *   },   
 *   token: <string>   
 * }
 * 
 */

module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false}, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is wrong Compadre!',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });
            });
        })(req, res);
    });
}