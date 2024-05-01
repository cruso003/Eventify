# Eventify Backend

This folder contains the backend codebase for Eventify, providing API endpoints and database functionality for the mobile application.

## Technologies Used

- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web application framework for Node.js.
- MongoDB: NoSQL database for storing event data.

## Getting Started

1. Install dependencies: `npm install`
2. Set up a MongoDB database and configure connection string in `.env || /config/development.json` file.
3. Start the development server: `npm start`
4. The server will run on [http://localhost:9000](http://localhost:9000) by default.

## Folder Structure

- `src`: Contains the source code for the backend application.
  - `config`: Configuration files for environment variables and database connection.
  - `controllers`: Request handlers for route endpoints.
  - `db`: Database connection to MongoDB.
  - `middleware`: Express middleware for handling requests.
  - `models`: Mongoose schema definitions for MongoDB collections.
  - `routes`: Express route definitions for handling API requests.
  - `utilities`: Express middleware for handling errors, generating OTP, sending mail etc.
  - `multer`: Handling files uploads
  - `server`: Server to connect to MongoDB
