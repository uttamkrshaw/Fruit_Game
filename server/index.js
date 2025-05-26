// Load env variables
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io'; // ✅ FIXED: Import Socket.IO Server
import { connectDB } from './config/db.js';
import { Routes } from './routes/routes.js';
import { UserModel } from './model/user.model.js';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

const corsOptions = {
    origin: process.env.clientUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
};

app.use(cors(corsOptions));

// Routes
app.use("/api/v1/", Routes);

// Setup Socket.IO
const io = new Server(server, { cors: corsOptions });

io.on('connection', (socket) => {
    console.log('✅ New client connected');

    // When user joins, fetch and send their score
    socket.on('scores', async () => {
        try {
            const user = await UserModel.find({ disabled: false, type: 'User' }, { password: 0 }).sort({ score: -1 })
            if (user) {
                socket.emit('rankings', user); // 🔥 send their score only to them
            }
        } catch (error) {
            console.error('Error fetching user score on join:', error.message);
        }
    });



    // When user joins, fetch and send their score
    socket.on('join', async (userId) => {
        try {
            const user = await UserModel.findById(userId);
            if (user && !user.disabled && user.type === 'User') {
                socket.emit('my_score', user.score); // 🔥 send their score only to them
            }
        } catch (error) {
            console.error('Error fetching user score on join:', error.message);
        }
    });

    // When user clicks, increment their score and broadcast updated leaderboard
    socket.on('increment', async (userId) => {
        try {
            const user = await UserModel.findOneAndUpdate(
                { _id: userId },
                { $inc: { score: 1 } },
                { new: true }
            );

            // Send updated individual score
            socket.emit('my_score', user.score);

            io.emit('my', user.score)

            // Broadcast updated leaderboard
            const users = await UserModel.find({ disabled: false, type: 'User' }).sort({ score: -1 });
            io.emit('update', users);
        } catch (error) {
            console.error('Error incrementing score:', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Client disconnected');
    });
});



server.listen(process.env.PORT, async () => {
    try {
        await connectDB();
        console.log(`🚀 Server started on PORT ${process.env.PORT}`);
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
    }
});
