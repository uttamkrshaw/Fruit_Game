"use client";

import UserNavbar from "@/components/navbar/usernavbar";
import UserRoute from "@/components/routes/userroutes";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import io from 'socket.io-client';

export default function RankingPage() {
    const [players, setPlayers] = useState([]);
    const { user } = useAuth();
    const socket = io('http://localhost:4500'); // Replace with actual domain in production

    // Replace this with your API URL

    useEffect(() => {
        if (user) {
            socket.emit("scores"); // 🔥 Request own score on connect
        }

        socket.on('rankings', (data) => {
            setPlayers(data);
        });

        socket.on('update', (data) => {            
            setPlayers(data);
        });

        return () => {socket.off('scores') }
    }, []);

    return (
        <>
            <UserRoute>
                <UserNavbar />
                <div className="max-w-2xl mx-auto py-10 px-4">
                    <h1 className="text-3xl font-bold mb-6 text-center">🏆 Banana Rankings</h1>
                    <ul className="bg-white shadow rounded-lg overflow-hidden">
                        {players.map((player, index) => (
                            <li
                                key={player.name}
                                className="flex text-black justify-between items-center px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                            >
                                <span className="font-medium">
                                    #{index + 1} {player.name}
                                </span>
                                <span className="text-yellow-600 font-semibold">{player.score} 🍌</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </UserRoute>
        </>
    );
}
