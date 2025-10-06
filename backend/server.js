const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration (place early)
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET','POST','PUT','DELETE','OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        msg: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const sosRoutes = require("./routes/sosRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const districtRoutes = require("./routes/districtRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CivicConnect API Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API documentation endpoint
app.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: "CivicConnect API Server", 
        version: "1.0.0",
        status: "running",
        documentation: {
            health: "/health",
            auth: "/api/auth",
            issues: "/api/issues", 
            leaderboard: "/api/leaderboard",
            sos: "/api/sos",
            users: "/api/users",
            notifications: "/api/notifications",
            districts: "/api/districts"
        },
        endpoints: {
            auth: {
                signup: "POST /api/auth/signup",
                login: "POST /api/auth/login",
                profile: "GET /api/auth/profile",
                updateProfile: "PUT /api/auth/profile",
                changePassword: "PUT /api/auth/change-password"
            },
            issues: {
                create: "POST /api/issues",
                getAll: "GET /api/issues",
                getById: "GET /api/issues/:id",
                upvote: "PUT /api/issues/:id/upvote",
                updateStatus: "PUT /api/issues/:id/status",
                delete: "DELETE /api/issues/:id"
            },
            users: {
                getAll: "GET /api/users",
                getById: "GET /api/users/:id"
            },
            leaderboard: {
                getTop: "GET /api/leaderboard/top",
                addEntry: "POST /api/leaderboard"
            },
            sos: {
                add: "POST /api/sos",
                getByDistrict: "GET /api/sos/district/:districtId"
            },
            notifications: {
                getUserNotifications: "GET /api/notifications",
                markAsRead: "PUT /api/notifications/:id/read",
                markAllAsRead: "PUT /api/notifications/mark-all-read"
            },
            districts: {
                getAll: "GET /api/districts",
                getById: "GET /api/districts/:id",
                create: "POST /api/districts",
                getStats: "GET /api/districts/:id/stats"
            }
        }
    });
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/superadmin", superAdminRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection with enhanced options
const connectDB = async () => {
    try {
        console.log("🔍 MONGO_URI:", process.env.MONGO_URI ? "Found" : "Not found");
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error("Database Error:", error.message);
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔒 Rate limiting: ${process.env.RATE_LIMIT_MAX || 100} requests per ${process.env.RATE_LIMIT_WINDOW || 15} minutes`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', err);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app;
