# Description
This is project consist in building an server-side of an Movie app. It contains API endpoints that allows users to register them selves creating a profile.
Once logged the user will have the possibilitie to access information about movies, their directors, genre and description. As well the possibilitie to add
a respective to a user's favorite list.

# Hosting
The API is hosted in Heroku Paas service at [https://mymovies-api-jbm.herokuapp.com/](https://mymovies-api-jbm.herokuapp.com/).<br>
The DataBase is hosted in MongoDB.

# Essential Features
- Allow new users to register
- Return a list of all movies to the User
- Return data (description, genre, director, image URL) about a single movie by title to the user
- Return data about a Genre (description) by name/title (e.g., “Thriller”)
- Return data about a Director (bio, birthdate and deathdate)
- Allow users to update their user info (username, password, email and birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

# Security
Authentication is controlled with the passport, passport-local, and passport-jwt libraries.<br>
Passwords are hashed using bcrypt when saved in the server. The successful login request will<br>
bear a JWT which will be required for token-based authorization at each endpoint.<br>

# Author
LinkdIn: [João Borges Mendonça](www.linkedin.com/in/jbm0288a26b)
