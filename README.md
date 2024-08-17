# Contacts Manager

This project is a Contacts Manager  application built with MEAN Stack. It includes various middlewares for security, logging, and compression, as well as rate limiting. The project also uses Bootstrap for styling.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Installation

1. Clone the repository:
   ```sh
   git clone 
   ```
2. Navigate to the project directory:
   ```sh
   cd APP
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and go to `http://localhost:8080` to see the application in action.

## Features

- **ExpressJS**: Utilizes the lightweight and flexible Express framework.
- **API Integration**: Fetches data from external APIs and renders it on the server.
- **Bootstrap**: Bootstrap for styling.
- **MVC Architecture**:

  ```sh
  APP/
  ├── controllers/ # Controllers for handling requests
  ├── middlewares/ # Custom middleware
  ├── models/ # Database models
  ├── routes/ # Express routes
  ├── .gitignore # Git ignore file
  ├── app.js # Main application file
  ├── package.json # NPM dependencies and scripts
  └── README.md # Project documentation

  ```

- **MongoDB**: MongoDB for the database.
- **Security and Performance Includes**:
  - Morgan for HTTP request logging.
  - Compression for response compression.
  - Error handling and 404 middlewares.
