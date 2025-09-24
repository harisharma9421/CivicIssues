# CivicConnect API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Headers
For protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "language": "English",
  "role": "user",
  "districtId": "64f8b1234567890abcdef123",
  "phoneNumber": "9876543210"
}
```

### POST /auth/login
User login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /auth/profile
Get current user profile
**Headers:** Authorization required

### PUT /auth/profile
Update user profile
**Headers:** Authorization required
```json
{
  "name": "John Smith",
  "language": "Hindi",
  "phoneNumber": "9876543210",
  "profilePicture": "https://example.com/profile.jpg"
}
```

### PUT /auth/change-password
Change user password
**Headers:** Authorization required
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

## 📋 Issue Endpoints

### GET /issues
Get all issues with optional filters
**Query Parameters:**
- `page=1` (optional)
- `limit=10` (optional)
- `status=pending|in_progress|resolved|rejected` (optional)
- `category=infrastructure|sanitation|safety|transport|environment|health|education|other` (optional)
- `priority=low|medium|high|urgent` (optional)
- `districtId=64f8b1234567890abcdef123` (optional)
- `sortBy=createdAt|upvoteCount` (optional)
- `sortOrder=desc|asc` (optional)

### GET /issues/:id
Get issue by ID

### POST /issues
Create new issue
**Headers:** Authorization required
```json
{
  "title": "Broken street light on Main Street",
  "description": "Street light is not working for the past 3 days, making the area unsafe at night",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090,
    "address": "Main Street, New Delhi"
  },
  "category": "infrastructure",
  "priority": "medium",
  "districtId": "64f8b1234567890abcdef123",
  "media": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

### PUT /issues/:id/upvote
Upvote an issue
**Headers:** Authorization required
*No body required*

### PUT /issues/:id/status
Update issue status (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "status": "resolved",
  "resolutionNotes": "Street light has been repaired and is now working properly",
  "assignedTo": "64f8b1234567890abcdef456"
}
```

### DELETE /issues/:id
Delete issue
**Headers:** Authorization required (Creator or Admin)

---

## 👥 User Endpoints

### GET /users
Get all users with optional filters
**Query Parameters:**
- `page=1` (optional)
- `limit=10` (optional)
- `districtId=64f8b1234567890abcdef123` (optional)
- `role=user|admin|superAdmin` (optional)
- `search=john` (optional)
- `sortBy=createdAt|points|name` (optional)
- `sortOrder=desc|asc` (optional)

### GET /users/:id
Get user by ID

### GET /users/:id/stats
Get user statistics

### PUT /users/:id/status
Update user status (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "isActive": true
}
```

---

## 🆘 SOS Endpoints

### GET /sos
Get all SOS contacts
**Query Parameters:**
- `districtId=64f8b1234567890abcdef123` (optional)
- `type=police|fire|medical|women_helpline|child_helpline|disaster|other` (optional)
- `emergencyLevel=low|medium|high|critical` (optional)
- `isActive=true|false` (optional)

### GET /sos/district/:districtId
Get SOS contacts by district

### GET /sos/:id
Get SOS contact by ID

### POST /sos
Add SOS contact (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "type": "police",
  "name": "Delhi Police Control Room",
  "phoneNumber": "100",
  "districtId": "64f8b1234567890abcdef123",
  "description": "24/7 Police emergency helpline",
  "emergencyLevel": "critical",
  "workingHours": {
    "start": "00:00",
    "end": "23:59"
  },
  "coordinates": {
    "lat": 28.6139,
    "lng": 77.2090
  }
}
```

### PUT /sos/:id
Update SOS contact (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "name": "Updated Police Control Room",
  "phoneNumber": "100",
  "description": "Updated description",
  "emergencyLevel": "high",
  "isActive": true
}
```

### DELETE /sos/:id
Delete SOS contact (Admin only)
**Headers:** Authorization required (Admin)

---

## 🏆 Leaderboard Endpoints

### GET /leaderboard/top
Get top users
**Query Parameters:**
- `limit=10` (optional)
- `districtId=64f8b1234567890abcdef123` (optional)
- `timeframe=all|monthly|yearly` (optional)

### GET /leaderboard/user/:userId/:districtId
Get user rank in district

### GET /leaderboard/district/:districtId/stats
Get district statistics

### POST /leaderboard
Add leaderboard entry
**Headers:** Authorization required
```json
{
  "userId": "64f8b1234567890abcdef789",
  "districtId": "64f8b1234567890abcdef123",
  "points": 100
}
```

### PUT /leaderboard/points
Update user points
**Headers:** Authorization required
```json
{
  "userId": "64f8b1234567890abcdef789",
  "points": 50,
  "reason": "Issue resolution bonus"
}
```

---

## 🔔 Notification Endpoints

### GET /notifications
Get user notifications
**Headers:** Authorization required
**Query Parameters:**
- `page=1` (optional)
- `limit=20` (optional)
- `isRead=true|false` (optional)

### GET /notifications/unread-count
Get unread notification count
**Headers:** Authorization required

### PUT /notifications/:notificationId/read
Mark notification as read
**Headers:** Authorization required
*No body required*

### PUT /notifications/mark-all-read
Mark all notifications as read
**Headers:** Authorization required
*No body required*

### DELETE /notifications/:notificationId
Delete notification
**Headers:** Authorization required

### POST /notifications
Create notification (for testing)
**Headers:** Authorization required
```json
{
  "title": "Welcome to CivicConnect",
  "message": "Thank you for joining our community!",
  "type": "system",
  "priority": "low"
}
```

---

## 🏛️ District Endpoints

### GET /districts
Get all districts
**Query Parameters:**
- `page=1` (optional)
- `limit=10` (optional)
- `state=Delhi` (optional)
- `verified=true|false` (optional)
- `isActive=true|false` (optional)
- `search=new` (optional)

### GET /districts/:id
Get district by ID

### GET /districts/:id/stats
Get district statistics

### POST /districts
Create district (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "name": "Central Delhi",
  "state": "Delhi",
  "adminId": "64f8b1234567890abcdef456",
  "population": 500000,
  "area": 100.5,
  "coordinates": {
    "lat": 28.6139,
    "lng": 77.2090
  },
  "contactInfo": {
    "phone": "011-12345678",
    "email": "admin@centraldelhi.gov.in",
    "address": "Central Delhi District Office"
  }
}
```

### PUT /districts/:id
Update district (Admin only)
**Headers:** Authorization required (Admin)
```json
{
  "name": "Updated Central Delhi",
  "population": 550000,
  "contactInfo": {
    "phone": "011-87654321",
    "email": "newadmin@centraldelhi.gov.in"
  }
}
```

### DELETE /districts/:id
Delete district (Super Admin only)
**Headers:** Authorization required (Super Admin)

### PUT /districts/:id/verify
Verify district (Super Admin only)
**Headers:** Authorization required (Super Admin)
```json
{
  "verified": true
}
```

---

## 📊 System Endpoints

### GET /
Get API documentation and server info

### GET /health
Get server health status

---

## 📁 File Upload

### File Upload for Issues
When creating issues with media, use `multipart/form-data`:
```
POST /issues
Content-Type: multipart/form-data

title: "Issue title"
description: "Issue description"
location: {"lat": 28.6139, "lng": 77.2090}
category: "infrastructure"
priority: "medium"
districtId: "64f8b1234567890abcdef123"
media: [file1.jpg, file2.jpg, file3.jpg] (max 5 files, 10MB each)
```

**Supported file types:**
- Images: jpeg, jpg, png, gif
- Videos: mp4, mov, avi
- Documents: pdf, doc, docx

---

## 🔒 Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "msg": "Error message",
  "error": "Detailed error (development only)"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🎯 Success Responses

All successful responses include:

```json
{
  "success": true,
  "msg": "Success message",
  "data": { ... } // Response data
}
```

For paginated responses:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```
