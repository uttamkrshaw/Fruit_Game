"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserNavbar from "@/components/navbar/usernavbar";
import UserRoute from "@/components/routes/userroutes";
import io from 'socket.io-client';
import { useAuth } from "@/context/AuthContext";
import { apiurl } from "@/defaults/apiurl";



export default function Home() {
    const router = useRouter();
    const { user } = useAuth()
    const [clickCount, setClickCount] = useState(0);
    const socket = io(`${apiurl}`); // Replace with actual domain in production

    useEffect(() => {
        if (user) {
            socket.emit("join", user._id); // 🔥 Request own score on connect
        }

        socket.on("my_score", (data) => {            
            setClickCount(data);
        });

        socket.on("my", (data) => {
            setClickCount(data);
        });
    }, [clickCount]);

    const handleClick = () => {
        socket.emit('increment', user._id);
    };

    return (
        <>
            <UserRoute>
                <UserNavbar />
                <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
                    <button
                        onClick={handleClick}
                        className="text-2xl px-6 py-3 bg-yellow-300 hover:bg-yellow-400 rounded-lg shadow-md transition"
                    >
                        🍌 Banana
                    </button>
                    <p className="mt-4 text-lg font-semibold text-yellow-800">
                        Your Bananas: {clickCount}
                    </p>
                </div>
            </UserRoute>

        </>
    );
}
