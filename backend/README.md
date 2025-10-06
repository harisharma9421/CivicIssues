# CivicConnect Backend API

A comprehensive backend API for CivicConnect - a civic engagement platform that allows citizens to report issues, engage with their communities, and track progress on civic matters.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User, Admin, Super Admin)
- Password hashing with bcrypt
- Profile management

### 🏛️ District Management
- District creation and management
- District verification system
- District statistics and analytics
- Multi-state support

### 📋 Issue Management
- Create, read, update, delete issues
- Issue categorization and prioritization
- Media upload support
- Status tracking (pending, in_progress, resolved, rejected)
- Upvoting system
- Location-based issue tracking

### 🆘 Emergency Services (SOS)
- Emergency contact management
- District-specific SOS services
- Emergency level classification
- Service verification system

### 🏆 Leaderboard System
- Points-based ranking system
- Monthly and yearly leaderboards
- Badge and achievement system
- District-wise statistics

### 🔔 Notification System
- Real-time notifications
- Email notifications
- Notification categorization
- Read/unread status tracking

### 📊 Analytics & Reporting
- User statistics
- District performance metrics
- Issue resolution tracking
- Community engagement analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Email**: Nodemailer
- **Logging**: Morgan, Winston
- **Validation**: Express-validator

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with the following variables:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/civicconnect
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=1d
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Email Configuration (Optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   
   # Rate Limiting
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   
   # CORS
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | User registration | No |
| POST | `/auth/login` | User login | No |
| GET | `/auth/profile` | Get user profile | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| PUT | `/auth/change-password` | Change password | Yes |

### Issue Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/issues` | Get all issues (with filters) | No |
| GET | `/issues/:id` | Get issue by ID | No |
| POST | `/issues` | Create new issue | Yes |
| PUT | `/issues/:id/upvote` | Upvote an issue | Yes |
| PUT | `/issues/:id/status` | Update issue status | Yes (Admin) |
| DELETE | `/issues/:id` | Delete issue | Yes |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users (with filters) | No |
| GET | `/users/:id` | Get user by ID | No |
| GET | `/users/:id/stats` | Get user statistics | No |
| PUT | `/users/:id/status` | Update user status | Yes (Admin) |

### SOS Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/sos` | Get all SOS contacts | No |
| GET | `/sos/district/:districtId` | Get SOS by district | No |
| GET | `/sos/:id` | Get SOS by ID | No |
| POST | `/sos` | Add SOS contact | Yes (Admin) |
| PUT | `/sos/:id` | Update SOS contact | Yes (Admin) |
| DELETE | `/sos/:id` | Delete SOS contact | Yes (Admin) |

### Leaderboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/leaderboard/top` | Get top users | No |
| GET | `/leaderboard/user/:userId/:districtId` | Get user rank | No |
| GET | `/leaderboard/district/:districtId/stats` | Get district stats | No |
| POST | `/leaderboard` | Add leaderboard entry | Yes |
| PUT | `/leaderboard/points` | Update user points | Yes |

### Notification Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | Yes |
| GET | `/notifications/unread-count` | Get unread count | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |
| PUT | `/notifications/mark-all-read` | Mark all as read | Yes |
| DELETE | `/notifications/:id` | Delete notification | Yes |

### District Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/districts` | Get all districts | No |
| GET | `/districts/:id` | Get district by ID | No |
| GET | `/districts/:id/stats` | Get district statistics | No |
| POST | `/districts` | Create district | Yes (Admin) |
| PUT | `/districts/:id` | Update district | Yes (Admin) |
| DELETE | `/districts/:id` | Delete district | Yes (Super Admin) |
| PUT | `/districts/:id/verify` | Verify district | Yes (Super Admin) |

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  language: String (default: "English"),
  points: Number (default: 0),
  role: String (enum: ["user", "admin", "superAdmin"]),
  districtId: ObjectId (ref: "District"),
  phoneNumber: String,
  profilePicture: String,
  isActive: Boolean (default: true),
  lastLogin: Date
}
```

### Issue Model
```javascript
{
  title: String (required),
  description: String (required),
  location: {
    lat: Number (required),
    lng: Number (required),
    address: String
  },
  category: String (enum: ["infrastructure", "sanitation", "safety", ...]),
  priority: String (enum: ["low", "medium", "high", "urgent"]),
  media: [String],
  createdBy: ObjectId (ref: "User"),
  districtId: ObjectId (ref: "District"),
  upvotes: [ObjectId (ref: "User")],
  status: String (enum: ["pending", "in_progress", "resolved", "rejected"]),
  assignedTo: ObjectId (ref: "User"),
  resolutionNotes: String,
  resolvedAt: Date
}
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Validation**: Express-validator
- **Password Hashing**: bcrypt
- **JWT Authentication**: Secure token-based auth
- **Error Handling**: Centralized error management

## File Upload

The API supports file uploads for issue media with the following features:
- Multiple file upload (up to 5 files)
- File type validation (images, videos, documents)
- Size limits (configurable, default 10MB)
- Secure file storage in `/uploads` directory

## Email Service

Automated email notifications for:
- User welcome emails
- Issue resolution notifications
- Points earned notifications
- Emergency alerts
- Admin notifications

## Error Handling

The API uses a centralized error handling system that:
- Logs all errors
- Returns consistent error responses
- Provides detailed errors in development
- Masks sensitive information in production

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Applied to all routes except health checks

## Health Check

```
GET /health
```

Returns server health status including:
- Server uptime
- Environment information
- Timestamp

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Environment Variables
See `.env.example` for all required environment variables. Key additions for OTP:

```env
# Email (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM="CivicConnect <no-reply@yourdomain.com>"

# Twilio (SMS OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_FROM=+1XXXXXXXXXX
# Optional: Twilio Verify (recommended for SMS OTP)
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# OTP config
OTP_TTL_MS=300000
OTP_MAX_ATTEMPTS=5
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure email service
5. Set up proper CORS origins
6. Configure rate limiting
7. Set up logging
8. Use process manager (PM2)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.
