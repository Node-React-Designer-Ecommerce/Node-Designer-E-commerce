# Node.js Backend for Sammly E-Commerce Platform

## Overview
This backend application supports the Sammly T-Shirt Design Platform, providing robust server-side functionality for user management, authentication, product handling, and image processing.

## Installation
### Prerequisites
- **Node.js** (Version 16+)
- **MongoDB** (Local or cloud instance)
- **npm**

### Setup Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Node-React-Designer-Ecommerce/Node-Designer-E-commerce.git
   cd node-designer-e-commerce
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the server:**
   ```sh
   npm start
   ```

## Technology Stack
### Core Technologies
- **Express.js**: Web application framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt**: Password hashing

## Key Dependencies
- **Authentication**
  - `jsonwebtoken`
  - `bcryptjs`
- **File Handling**
  - `multer`
  - `sharp`
  - `imagekit`
- **Validation**
  - `joi`
- **Utilities**
  - `dotenv`
  - `cors`
  - `winston` (logging)

## Features
- User Authentication
- Secure API Endpoints
- Image Upload & Processing
- Email Notifications
- Error Handling
- Validation Middleware

## Environment Configuration
Create `.env` file with:
- `MONGODB_CONNECTION_STRING`
- `JWT_SECRET`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`

## Security Measures
- Password encryption
- JWT-based authentication
- Input validation
- CORS protection
- Error logging

## API Endpoints
- `/auth`: User registration/login
- `/products`: Product management
- `/orders`: Order processing
- `/designs`: T-Shirt design handling

## Development Tools
- **Nodemon**: Automatic server restart
- **Morgan**: HTTP request logging
- **Pug**: Email template rendering

## Logging
Utilizes Winston for comprehensive logging and error tracking

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Deployment Considerations
- Supports Node.js >= 16
- Compatible with various cloud platforms
- Environment-specific configurations

## License
ISC License

## Support
For issues or questions, open a GitHub issue.
