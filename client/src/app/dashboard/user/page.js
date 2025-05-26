"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import UserNavbar from "@/components/navbar/usernavbar";
import UserRoute from "@/components/routes/userroutes";
import io from 'socket.io-client';
import { useAuth } from "@/context/AuthContext";



export default function Home() {
    const router = useRouter();
    const { user } = useAuth()
    const [clickCount, setClickCount] = useState(0);
    console.log("user in dashboard", user);
    const socket = io('http://localhost:4500'); // Replace with actual domain in production


    // useEffect(() => {
    //     // socket.on('update', (data) => {
    //     //     // setUsers(data);
    //     //     console.log(data);

    //     // });

    //     // return () => socket.off('update');

    //     socket.emit("join", user._id); // 🔥 Request own score on connect

    //     socket.on("my_score", (myScore) => {
    //         setScore(myScore);
    //     });
    //     socket.on('join', (data) => {
    //         setClickCount(data);

    //     });

    //     return () => socket.off('join');
    // }, []);



    useEffect(() => {
        if (user) {
            socket.emit("join", user._id); // 🔥 Request own score on connect
        }

        socket.on("my_score", (myScore) => {
            setClickCount(myScore);
        });

        // socket.on("update", (users) => {
        //     setLeaderboard(users);
        // });

        return () => {
            // socket.off("my_score");
            // socket.off("update");
        };
    }, [clickCount]);

    const handleClick = () => {
        setClickCount(clickCount + 1);
        socket.emit('increment', user._id);
    };


    // const handleClick = () => {
    //     socket.emit('increment', user._id);
    // };

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
