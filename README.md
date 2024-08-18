# Contacts Manager

This project is a Contacts Manager application built with MEAN Stack. It includes various middlewares for security, logging, and compression, as well as real time app. The project also uses Bootstrap for styling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/lamiaaselim/Contacts-Manager
   ```

- **1. Server Side**:

1. Navigate to the project directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

- **2. Client Side**:

1. Navigate to the project directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Usage

- **1. Server Side**:

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and go to `http://localhost:8080` to see the application in action.

- **2. Client Side**:

1. Navigate to the src directory:
   ```sh
   cd src
   ```
1. Start the development server:
   ```sh
   ng serve
   ```
1. Open your browser and go to `http://localhost:4200` to see the application in action.

## Features

- **ExpressJS**: Utilizes the lightweight and flexible Express framework.
- **API Integration**: Fetches data from external APIs and renders it on the server.
- **Bootstrap**: Bootstrap for styling.
- **MVC Architecture For Server Side**:

  ```sh
  APP Contact/
  ├──
   server/
   ├── controllers/ # Controllers for handling requests
   ├── middlewares/ # Custom middleware
   ├── models/ # Database models
   ├── routes/ # Express routes
   ├── .gitignore # Git ignore file
   ├── app.js # Main application file
   ├── package.json # NPM dependencies and scripts
  ```

  - **LIFT principle Architecture For client Side**:

  ```sh
  APP Contact/
  ├──
   client/
      ├──
      src/
         ├──
         app/
         ├── components/ # Reusable UI components
         ├── guards/ # Enforce authentication and authorization rules.
         ├── services/ # Handle data fetching and business logic.
         ├── interface/ # Define contracts for components, services, and data structures.
         ├── app.module.ts # The main application module, importing necessary components, services, and configurations.
  ```

- **MongoDB**: MongoDB for the database.
- **Security and Performance Includes**:

  - Morgan for HTTP request logging.
  - Compression for response compression.
  - Error handling and 404 middlewares.

- **Enviroment Variables**: to test our app, you need our .env file that contains:
  -Set the environment to development or production
  NODE_ENV="development"

  -Server configuration
  PORT = 8080

  -Database configuration
  DB_CONNECTION_STRING = 'mongodb://127.0.0.1:27017/ContactManager'

  -JWT configuration
  JWT_SECRET='jwtSecret'
