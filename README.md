# User CRUD Operations

## Setup

## Running

## Decisions
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

- **Project structure:** I tried to minimize over-engineering, but at the same time demonstrate the structure of a Node.js application that is comfortable to built upon and scale.

- **Persistence:** I chose to go for MongoDB with Mongoose, just because it's simple to get started. The implementation is easy. A good alternative would be any relational database with TypeORM.

- **Password:** Password strength enforcement has not been implemented on purpose (time), although this can easily be done using regular expressions.

  For encryption, I chose to use bcrypt. I like it because it's simple, and features unique salts per user which is a very strong defense compared to a single hash for all users.

- **Logging:** The application features one log level. In a production-ready application I would include several levels of verbosity (environment-dependant) and possibly external logging services for alerts.

- **Run mode:** The application runs in development mode. In a production-ready application I would set up configurations for different environments, and utilise environment variables.