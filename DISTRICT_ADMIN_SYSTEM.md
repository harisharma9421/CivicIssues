# CivicConnect - District-Wise Admin Management System

## 🏛️ System Overview

A comprehensive civic issue management platform with **district-wise admin management**. The system features a single super admin and multiple district-specific admins with a clear approval workflow.

## 🔐 Authentication Hierarchy

### **Super Admin** (Pre-configured)
- **Single Account**: Only one super admin account exists
- **Pre-configured**: Created via database script, not through web interface
- **Highest Privileges**: Manages all district admins and system oversight
- **Login**: `/superadmin/login`

### **District Admins** (Multiple)
- **District-Specific**: Each admin is assigned to a specific district
- **Approval Required**: Must be approved by super admin before access
- **Registration**: `/admin/signup` - Register with district information
- **Login**: `/admin/login` - Access district-specific dashboard

## 🚀 Getting Started

### 1. Create Super Admin Account

```bash
# Navigate to backend directory
cd backend

# Create super admin account
npm run create-superadmin
```

**Default Super Admin Credentials:**
- Email: `superadmin@civicconnect.com`
- Password: `superadmin123`
- **⚠️ Change password after first login!**

### 2. Start the Application

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📋 User Workflows

### **District Admin Registration & Approval**

1. **Admin Registration** (`/admin/signup`)
   - District admins register with:
     - Personal information (name, email, password)
     - Contact details (phone, Aadhar)
     - **District assignment** (district name, state)
   - Status: `pending` (awaiting super admin approval)

2. **Super Admin Review** (`/superadmin/login`)
   - Super admin logs in
   - Views pending admin requests
   - Reviews district assignment
   - Approves or rejects requests

3. **Admin Access** (`/admin/login`)
   - Approved admins can log in
   - Access district-specific dashboard
   - Manage civic issues for their district

### **Super Admin Workflow**

1. **Login**: `/superadmin/login`
2. **Dashboard**: View system overview and pending requests
3. **Admin Management**: 
   - Review pending district admin requests
   - Approve/reject with district assignment
   - Monitor admin activity and performance

### **District Admin Workflow**

1. **Registration**: `/admin/signup` (with district information)
2. **Await Approval**: Super admin reviews and approves
3. **Login**: `/admin/login` (after approval)
4. **Dashboard**: District-specific civic issue management

## 🗄️ Database Schema Updates

### **User Model Changes**
```javascript
// District and state are now required for admin role
districtName: { 
  type: String,
  required: function() { return this.role === 'admin' },
  trim: true
},
state: { 
  type: String,
  required: function() { return this.role === 'admin' },
  trim: true
}
```

### **District Model**
- Each district has an assigned admin
- Districts are created/assigned during admin approval
- District verification status tracking

## 🎯 Key Features

### **Super Admin Portal**
- **Admin Approval**: Review and approve district admin requests
- **System Oversight**: Monitor all districts and admins
- **Performance Metrics**: Track admin activity and system health
- **District Management**: Assign and manage district assignments

### **District Admin Portal**
- **District-Specific Dashboard**: Issues and metrics for assigned district
- **Report Management**: Handle civic issues within district
- **Analytics**: District-specific insights and trends
- **Heatmap**: Geographic visualization of district issues
- **Leaderboard**: Citizen engagement within district

## 🔧 Technical Implementation

### **Backend Changes**
- **User Model**: District/state required for admin role
- **Approval Logic**: Enhanced admin moderation with district assignment
- **Validation**: Proper validation for district-specific fields

### **Frontend Changes**
- **Removed Super Admin Signup**: Pre-configured account only
- **District-Focused UI**: Emphasizes district-wise admin system
- **Enhanced Approval Interface**: Better district assignment workflow

### **Security Features**
- **Role-Based Access**: Strict separation between super admin and district admins
- **District Isolation**: Admins can only access their assigned district
- **Approval Workflow**: Secure admin onboarding process

## 📱 User Interface Updates

### **Authentication Pages**
- **Admin Signup**: District-focused registration form
- **Admin Login**: District admin login interface
- **Super Admin Login**: Pre-configured account access

### **Dashboard Updates**
- **Super Admin Dashboard**: Pending admin requests with district info
- **District Admin Dashboard**: District-specific metrics and controls
- **Enhanced UI**: Better visualization of district assignments

## 🚀 Deployment Instructions

### **1. Database Setup**
```bash
# Create super admin account
npm run create-superadmin
```

### **2. Environment Variables**
```bash
# Backend .env
MONGODB_URI=mongodb://localhost:27017/civicconnect
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
```

### **3. Start Services**
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

## 🔍 Testing the System

### **1. Create Super Admin**
```bash
cd backend
npm run create-superadmin
```

### **2. Test Admin Registration**
1. Go to `/admin/signup`
2. Register with district information
3. Check status is "pending"

### **3. Test Super Admin Approval**
1. Go to `/superadmin/login`
2. Login with super admin credentials
3. View pending admin requests
4. Approve/reject with district assignment

### **4. Test District Admin Login**
1. After approval, go to `/admin/login`
2. Login with district admin credentials
3. Access district-specific dashboard

## 📊 System Benefits

### **District-Wise Management**
- **Localized Control**: Each district has dedicated admin
- **Better Coverage**: District-specific issue management
- **Scalable**: Easy to add new districts and admins

### **Centralized Oversight**
- **Super Admin Control**: Single point of system management
- **Quality Assurance**: All admins approved by super admin
- **System Monitoring**: Centralized oversight and analytics

### **Security & Compliance**
- **Approval Workflow**: Secure admin onboarding
- **Role Separation**: Clear hierarchy and permissions
- **Audit Trail**: Track admin assignments and activities

## 🛠️ Maintenance

### **Adding New Districts**
1. District admins register with new district information
2. Super admin reviews and approves
3. District is automatically created/assigned

### **Admin Management**
- **Deactivation**: Super admin can deactivate district admins
- **Reassignment**: Change district assignments as needed
- **Performance Monitoring**: Track admin activity and effectiveness

---

**This system provides a robust, scalable solution for district-wise civic issue management with proper administrative oversight and control.**
