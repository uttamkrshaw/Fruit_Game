"use client";

import UserNavbar from "@/components/navbar/usernavbar";
import UserRoute from "@/components/routes/userroutes";
import { useEffect, useState } from "react";
import io from 'socket.io-client';

export default function RankingPage() {
    const [players, setPlayers] = useState([]);
    const socket = io('http://localhost:4500'); // Replace with actual domain in production


    // // Replace this with your API URL
    // const fetchPlayerData = async () => {
    //     const token = JSON.parse(localStorage.getItem('token'))
    //     try {
    //         const res = await axios.get(`${apiurl}user/listall`, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //         const data = await res.data;
    //         if (data.status === 'success') {
    //             setPlayers(data?.data)
    //         } else {
    //             toast.error(data.message)
    //         }
    //     } catch (error) {
    //         toast.error(error.message)
    //     }
    // };

    useEffect(() => {
        socket.on('update', (data) => {
            console.log(data);
            
            setPlayers(data);
        });

        return () => socket.off('update');
    }, []);

    // useEffect(() => {
    //     fetchPlayerData(); // Initial fetch

    //     // Poll every 3 seconds for updates
    //     const interval = setInterval(fetchPlayerData, 3000);
    //     return () => clearInterval(interval);
    // }, []);

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
