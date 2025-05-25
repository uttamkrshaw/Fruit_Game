import 'dotenv/config'

import express from 'express';
import cors from 'cors';
import { createServer } from "http";
import { connectDB } from './config/db.js';
import { Routes } from './routes/routes.js';
const app = express();
const server = createServer(app);

app.use(express.json())
// const io = new Server(server, {
//     cors: {
//         origin: process.env.clientUrl,
//         methods: ["GET", "POST", "PATCH", "DELETE"],
//         credentials: true
//     }
// });

app.use(cors({
    origin: process.env.clientUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))

app.use("/api/v1/",Routes)



server.listen(process.env.PORT, async () => {
    try {
        await connectDB();
        console.log(`Server Started On PORT ${process.env.PORT}`);
    } catch (error) {
        console.log(`Failed To Run Server. Error Reason :- ${error.message}`);

    }
})