# CivicConnect / CivicIssues

CivicConnect is a **Smart Civic Issues Management System** designed to help citizens report civic problems efficiently and for administrators to manage, track, and resolve issues in real-time. The platform includes role-based access, real-time notifications, analytics, and a robust verification system for district admins.

---

## **Table of Contents**
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [License](#license)

---

## **Project Overview**

CivicConnect allows citizens to report issues like potholes, streetlight failures, water supply problems, etc., directly through the platform. The system ensures **verified district admins** receive, track, and resolve issues efficiently. The platform also includes **analytics** to monitor issue resolution performance and **geolocation-based reports** for better governance.

**Key Highlights:**
- Real-time issue reporting and tracking
- Verified district admin login
- GIS-based district management
- Analytics for resolution statistics
- Secure document verification (optional integration with DigiLocker / Aadhaar)

---

## **Features**

### **For Citizens**
- Report civic issues with title, description, images
- Track status of submitted issues
- Location-based reporting
- Recent issues feed
- Push notifications (if integrated)

### **For District Admins**
- Role-based login and dashboard
- View assigned issues
- Mark issues as resolved or pending
- Analytics: resolution rate, recent issues, total users
- Verification of citizen-submitted documents (optional)

### **For Super Admin / Government Officials**
- Verify district admins
- Approve or reject district applications
- Overall dashboard with metrics

---

## **Tech Stack**

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js, HTML, CSS, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Geolocation** | GeoJSON, reverse geocoding via OpenStreetMap API |
| **Document Verification** | DigiLocker / Aadhaar XML verification (optional) |
| **Hosting / Deployment** | GitHub, Heroku / VPS (your choice) |
| **Version Control** | Git & GitHub |

---

## **Installation & Setup**

### **1. Clone the repository**
```bash
git clone https://github.com/harisharma9421/CivicIssues.git
cd CivicIssues
cd backend
npm install
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
npm run dev
cd ../frontend
npm install
npm start



### 🔹 Note about Flutter App
- The **Flutter application** allows users to report civic issues directly from their mobile device.  
- Extra features like **push notifications, real-time updates, and analytics** are under development.  
- The app folder will be updated and pushed once the work is completed.



