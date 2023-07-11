# MyChats Server

## Overview
MyChats is an Express.js server application that provides a platform for real-time chatting and messaging. This server application is designed to handle chat-related functionality such as user authentication, message sending, and receiving. It utilizes the power of Express.js framework and various additional libraries to create a chat server.

## Features
- User registration and authentication
- Real-time messaging
- Online presence indicators
- Message history retrieval
- Typing indicators
- Emojis and image attachments
- User profile management

## Client Application
The client application for MyChats is built using [Flutter](https://flutter.dev/) framework and can be found in the [mychats_client](https://github.com/hardikroongta8/mychats_client) repository.

## Getting Started
1. Clone this repository to your local machine or download the source code.
2. Open a terminal and navigate to the project's root directory.
3. Install the dependencies by running the following command:
   ```
   npm install
   ```
4. Once the dependencies are installed, you can start the server using the following command:
   ```
   npm start
   ```
5. The server will start running on `http://localhost:3000` by default.

## Configuration
The server can be configured through environment variables. The following variables are available:

- `PORT`: The port on which the server should listen (default: 3000).
- `MONGO_URL`: The URL of the MongoDB connection.
- `ACCESS_TOKEN_SECRET`: Secret key used for signing access tokens.
- `REFRESH_TOKEN_SECRET`: Secret key used for signing refresh tokens.
- `CLOUD_NAME`: Cloudinary cloud name for storing file attachments.
- `CLOUD_API_KEY`: Cloudinary API key for accessing the cloud storage.
- `CLOUD_API_SECRET`: Cloudinary API secret for accessing the cloud storage.

You can set these environment variables in a `.env` file in the project's root directory.

## API Endpoints
Please refer to the source code or [API documentation](https://documenter.getpostman.com/view/21951680/2s93zH1eJB) for detailed request and response formats.

## Dependencies
The main dependencies used in this project are:
- Express.js: Fast, unopinionated, minimalist web framework for Node.js.
- Socket.IO: Real-time event-based communication library.
- Mongoose: MongoDB object modeling for Node.js.
- JWT: JSON Web Token implementation.
- Cloudinary: Cloud-based media management platform.
- Multer: Middleware for handling multipart/form-data, used for file uploading.
- Streamifier: Library for converting streams to buffers.

## Contributing
Contributions to this project are welcome. Feel free to fork the repository, make improvements, and submit a pull request.
