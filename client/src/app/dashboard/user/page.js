"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiurl } from "@/defaults/apiurl";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import UserNavbar from "@/components/navbar/usernavbar";
import { useAuth } from "@/context/AuthContext";
import UserRoute from "@/components/routes/userroutes";


export default function Home() {
    const router = useRouter();
    const [clickCount, setClickCount] = useState(0);

    const handleClick = () => {
        setClickCount(prev => prev + 1);
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
