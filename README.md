# User CRUD Operations

## Setup

## Running

## Decisions
- I tried to minimize over-engineering, but at the same time demonstrate the structure of my average Node.js application (use-case specific, of course).

- I chose to go for MongoDB with Mongoose. just because it's simple to get started. The implementation is easy. A good alternative would be any relational database with TypeORM.

- Password strength enforcement has not been implemented on purpose, although this can easily be done using regular expressions.

- The application features one log level. In a production-ready application I would include several levels of verbosity, depending on the environment.

- The application runs on a development environment. In a production-ready application I would set up configurations for different environments, and utilise environment variables.