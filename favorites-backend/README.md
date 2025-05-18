# Favorites Backend Service

This is the backend service for the Country Explorer application, handling user favorites functionality with MongoDB integration.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## Features
- RESTful API for managing country favorites
- MongoDB integration for data persistence
- Express.js server with CORS support
- Jest testing suite with supertest
- Error handling and validation

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- Jest & Supertest for testing
- CORS for cross-origin support
- dotenv for environment management

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- npm or yarn package manager

### Installation
1. Clone the repository (if not already done)
2. Navigate to the backend directory:
   ```bash
   cd favorites-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:5000 (or your specified PORT)

## API Documentation

### Endpoints

#### Add a Favorite
- **POST** `/api/favorites`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "country": {
      "name": { "common": "Country Name" },
      "cca3": "ABC",
      "flags": { "png": "flag-url.png" }
    }
  }
  ```
- **Response:** 201 Created
  ```json
  {
    "email": "user@example.com",
    "country": {
      "name": { "common": "Country Name" },
      "cca3": "ABC",
      "flags": { "png": "flag-url.png" }
    }
  }
  ```

#### Get User's Favorites
- **GET** `/api/favorites/:email`
- **Response:** 200 OK
  ```json
  [
    {
      "email": "user@example.com",
      "country": {
        "name": { "common": "Country Name" },
        "cca3": "ABC",
        "flags": { "png": "flag-url.png" }
      }
    }
  ]
  ```

#### Remove a Favorite
- **DELETE** `/api/favorites/:email/:code`
- **Response:** 200 OK
  ```json
  {
    "message": "Removed"
  }
  ```

## Testing

The backend includes a comprehensive test suite using Jest and Supertest. To run the tests:

```bash
npm test
```

Tests cover:
- Adding favorites
- Retrieving favorites
- Removing favorites
- Error handling
- Input validation

## Environment Variables

Required environment variables:
- `MONGO_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)

Optional environment variables:
- `NODE_ENV`: Environment mode (development/production)

## Error Handling

The API includes robust error handling for:
- Invalid requests
- Database errors
- Duplicate entries
- Not found resources

## Development

To start the development server with hot reload:
```bash
npm run dev
```

For production:
```bash
npm start
``` 