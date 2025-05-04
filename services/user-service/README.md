# User Service

This is the User Service for the Uber-like application. It handles user authentication, registration, and management.

## Features

- User registration and authentication
- JWT-based authentication
- User profile management
- Role-based access control (Customer/Driver)
- Password hashing and security
- Input validation
- Error handling
- MongoDB integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the user service directory:
   ```bash
   cd services/user-service
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/uber-users
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)

## Testing

Run tests:
```bash
npm test
```

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation is implemented
- CORS is configured
- Helmet is used for security headers

## Error Handling

The service includes comprehensive error handling for:
- Validation errors
- Authentication errors
- Database errors
- Route not found errors
- General server errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 