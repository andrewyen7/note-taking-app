# Note Taking App

A full-stack note-taking application with user authentication that allows users to create, read, update, and delete notes.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete notes
- Responsive design
- Secure API with JWT authentication
- MongoDB database for data storage

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript 
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd note-taking-app
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the server directory if it doesn't exist
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/note-taking-app
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     JWT_COOKIE_EXPIRE=30
     ```
   - Replace `your_jwt_secret_key` with a secure random string
   - Update `MONGODB_URI` if you're using MongoDB Atlas

4. Start the server:
   ```
   npm run dev
   ```

5. Open the client:
   - Navigate to the `client` directory
   - Open `index.html` in your browser, or use a simple HTTP server:
     ```
     npx serve -s client
     ```

## API Endpoints

### Authentication Routes

- **POST** `/api/auth/register` - Register a new user
  - Request body: `{ name, email, password }`
  - Response: `{ success, token, user }`

- **POST** `/api/auth/login` - Login a user
  - Request body: `{ email, password }`
  - Response: `{ success, token, user }`

- **GET** `/api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data }`

### Note Routes

- **GET** `/api/notes` - Get all notes for the authenticated user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, count, data }`

- **GET** `/api/notes/:id` - Get a single note
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data }`

- **POST** `/api/notes` - Create a new note
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ title, content }`
  - Response: `{ success, data }`

- **PUT** `/api/notes/:id` - Update a note
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ title, content }`
  - Response: `{ success, data }`

- **DELETE** `/api/notes/:id` - Delete a note
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, data }`

## Development Process and Lessons Learned

### Challenges Faced

1. **Authentication Implementation**: Implementing secure JWT authentication required careful consideration of token storage, validation, and expiration.

2. **Cross-Origin Resource Sharing (CORS)**: Ensuring proper CORS configuration to allow the frontend to communicate with the backend API.

3. **Error Handling**: Creating a robust error handling system that provides meaningful feedback to users.

4. **User Experience**: Designing a clean and intuitive interface that makes note management easy and efficient.

### Lessons Learned

1. **API Design**: The importance of consistent API design and proper error responses for a smooth frontend-backend integration.

2. **Security Considerations**: The need for proper authentication and authorization to protect user data.

3. **Frontend-Backend Communication**: The value of clear communication protocols between the frontend and backend.

4. **User-Centric Design**: The significance of focusing on user experience when designing both the interface and functionality.

## Future Improvements

- Add note categories/tags
- Implement rich text editing
- Add search functionality
- Create a mobile app version
- Implement social sharing features

## License

This project is licensed under the MIT License.
