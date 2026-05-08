import "dotenv/config.js";
import express from "express";
import { createServer } from "node:http";
import net from "node:net";
import mongoose from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const preferredPort = Number(process.env.PORT || 8001);
let mongoConnected = false;

// CORS configuration with environment variable support
const allowedOrigins = [
    // Development
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
];

// Add production frontend URL from environment
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (_req, res) => {
    return res.json({ hello: "world" });
});

app.get("/health", (_req, res) => {
    return res.json({
        status: "ok",
        message: "Server is running",
        socketConnections: io.engine.clientsCount,
    });
});

const start = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (mongoUri) {
            const connectionDb = await mongoose.connect(mongoUri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            mongoConnected = true;
            console.log(`✅ MongoDB connected: ${connectionDb.connection.host}`);
        } else {
            console.warn("⚠️  MONGODB_URI is not set. Starting server without a database connection.");
        }
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        console.log("⚠️  Please check:");
        console.log("   1. MongoDB Atlas IP whitelist");
        console.log("   2. Database credentials");
        console.log("   3. Network connection");
        console.log("   4. Whether MONGODB_URI is set correctly");
        console.log("⚠️  Starting server without a database connection.");
    }

    const startListening = (port) => {
        app.set("port", port);

        server.once("error", (error) => {
            if (error.code === "EADDRINUSE") {
                const nextPort = port + 1;
                if (nextPort <= preferredPort + 10) {
                    console.warn(`⚠️  Port ${port} is in use, trying ${nextPort}...`);
                    startListening(nextPort);
                    return;
                }

                console.error(`❌ No free port found near ${preferredPort}`);
                process.exit(1);
            }

            throw error;
        });

        server.listen({ port, host: "0.0.0.0" }, () => {
            console.log(`🚀 Server listening on port ${port}`);
            console.log(`📡 Socket.io ready for connections`);
            console.log(`🌐 CORS enabled for: http://localhost:5173`);
            console.log(`🗄️  MongoDB status: ${mongoConnected ? "connected" : "disconnected"}`);
        });
    };

    startListening(preferredPort);
};

start();
