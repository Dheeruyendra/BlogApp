# BlogApp

A full-stack blogging application with a React frontend and an Express backend.

## Features

- User Authentication: Register and login functionality with secure password hashing.
- Blog Posts: Create, view, and edit blog posts.
- Image Uploads: Support for image uploads in blog posts.
- Persistent Data Storage: Utilizes MongoDB for storing user and post data.

## Frontend

Built with React, the frontend includes a routing system with `react-router-dom` for navigating between different pages like the home page, login, registration, post creation, and individual post pages.

## Backend

The `server.js` sets up an Express server with CORS enabled for local development and cookie-parser for handling HTTP cookies. It provides API endpoints for user authentication, blog post operations, and static file serving for uploaded images.

## Getting Started

1. Clone the repository.
2. Install dependencies for both client and server.
3. Set up your `.env` file with your database URI and secret key for JWT.
4. Run the server with `node server.js`.
5. Start the React app in the client directory with `npm start`.

## Contributing

Contributions are welcome. Feel free to open a pull request or an issue to discuss proposed changes or additions.
