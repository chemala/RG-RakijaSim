# ES6/WebGL 2.0 Examples
A collection of ES6/WebGL 2.0 examples for undergraduate computer graphics courses.

# Building and running
The examples do not need to be built, but some of them require a server
capable of serving static files (WebGL+CORS restrictions). A basic Node.js
implementation is available in `bin/server.js`.

# Project structure
The project is structured as follows:

- The root directory contains `index.html`, the project's front page that
  lists all examples with links to their respective pages.
- The `lib` directory holds the libraries. We use libraries when something
  is too tedious or prone to error if written by hand or out of the scope of
  this project.
- The `common` directory contains all the resources and initialisaton code used in the `game` directory
- Finally, the `game` directory contains all of the neccessary code, classes and functions to run the game including the 
.html file and .js files.

