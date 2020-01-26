# User CRUD Operations
## Endpoints
You can find a [Postman collection](postman_collection.json) export in this repository for ease of testing.

|        Endpoint        |     Description     |
|:----------------------:|:-------------------:|
| GET /user              |    Get all users    |
| GET /user/:id          |    Get user by ID   |
| POST /user             |     Create user     |
| DELETE /user/:id       |  Delete user by ID  |
| PATCH /user/:id/avatar | Set user avatar URL |

Example request for user creation:
```js
// POST http://localhost:3000/user

{
  "firstName": "Ariel",
  "lastName": "Weinberger",
  "username": "arielweinberger",
  "password": "supersecret"
}
```

Example request for avatar setting:
```js
// PATCH http://localhost:3000/5e2cd0a54cf1b50012ed30c6/avatar

{
  "url": "https://via.placeholder.com/150x150.png"
}
```

## Running the application
### Development mode
The application expects a MongoDB database to be running on port 27017.
```bash
npm install
npm run start:dev
```

### Docker Compose
You can use Docker Compose to easily spin up the application along with a local MongoDB container.
```bash
docker-compose build
docker-compose up

# test the application
curl localhost:3000/user
```

## Conclusions
I ended up spending a total of around 6 hours on this assignment.

After performing this assignment, I realized that the JS community is moving very fast toward TypeScript, yet traditional tools are still widely used. These tools are not well-adapted to use TypeScript. This can especially be felt when performing tests. Good examples are Mongoose and barebones Express which are very hard to interface with testing frameworks. Using TypeScript-era tooling makes testing a lot easier.

## Decisions
- **Dockerization:** Normally I would use the slimmest Docker images possible (node-alpine, for example), but I did not want to start dealing with installing Python and other depdendencies of node-gyp. So in this case, I used `node:10`.

- **Avatar storage:** As the instructions state "pick a way of storing you think is most efficient", I decided to simply accept URLs which will be stored as a string in the database. This results in zero maintenance and replication overhead.

  There are two disadvantages though:
  (1) Non-technical users might struggle with this approach.
  (2) The avatars rely entirely on an external party. Which means, if the links break, users lose their avatars.

  Again, I chose the most efficient way as requested. Below are some viable alternatives:

  Some alternatives:
  - Storing the avatars locally (filesystem). This introduces a wide range of potential issues. Files need to be scanned, must be saved on a shared volume (horizontal scaling requires copies across several availability zones, which is expensive), file size validation and/or downscaling and much more.
  - Storing the avatars on S3 - relatively cheap, scaling is managed, yet still required to validate file size and perform downscaling if necessary. This is probably what I would do in a production-ready application.
  - Base64 storage in the database is an okay option if we limit the avatars to a sensible size. However, these are quite long. Same replication challenges as #1 are present, although there are plenty of common tools that help with read replicas for databases. Still, very expensive.
  - An external reliable avatar service service such as Gravatar. The downside is, it requires integration (minor) and requires users to sign up to an external service (major).

- **Project structure:** I tried to minimize over-engineering, but at the same time demonstrate the structure of a Node.js application that is comfortable to built upon and scale. This resembles of the Controller/Service pattern. There are API handlers which only deal with HTTP request handling, and the service which perform the heavy business logic. I would consider choosing a framework such as NestJS (based on Express) which makes this a lot easier to build/maintain and especially easier to test.

- **Persistence:** I chose to go for MongoDB with Mongoose, just because it's simple to get started. The implementation is easy. A good alternative would be any relational database with TypeORM.

- **Password:** Password strength enforcement has not been implemented on purpose (time), although this can easily be done using regular expressions.

  For encryption, I chose to use bcrypt. I like it because it's simple, and features unique salts per user which is a very strong defense compared to a single hash for all users.

- **Logging:** The application features one log level. In a production-ready application I would include several levels of verbosity (environment-dependant) and possibly external logging services for alerts.

  For logging, I chose to go for structured logs with Bunyan. There is a wide variety of loggers out there, and I don't have any strong preference.

  I did my best to include the relevant request parameters as well as a unique request ID per log, as this is what I would do in a real application. Although in a real application I would most likely create a middleware to simplify the API of logging errors, as this one can easily get over-bloated.

- **Run mode:** The application runs in development mode. In a production-ready application I would set up configurations for different environments, and utilise environment variables.

- **Testing:** Due to limited time, I did not cover the application with tests. However, I feel very comfortable writing tests in multiple technologies. This has been an integral part of my work for the past years.

  Here are some examples of repositories where I've written tests to the best of my ability:
  * [nestjs-course-task-management](https://github.com/arielweinberger/nestjs-course-task-management/tree/testing/10-testing-jwt-strategy/src): The GitHub repository of my Udemy course project. Decently covered with tests - services, repositories, controllers and utility functions. This uses TypeScript with Jest.
  * [stocks-assessment](https://github.com/arielweinberger/stocks-assessment/tree/master/server/src/spec): Back-end server for an assignment I did two years ago, with full coverage (using Jasmine).
  * [stocks-assessment](https://github.com/arielweinberger/stocks-assessment/tree/master/client/src/app): The front-end application (Angular) for the same application, with full coverage.