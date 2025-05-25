"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiurl } from "@/defaults/apiurl";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import OpenRoute from "@/components/routes/openroutes";
import { useState } from "react";
import Login from "@/components/login";
import Register from "@/components/register";


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
});

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <OpenRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setShowLogin(true)}
              className={`px-4 py-2 rounded ${showLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`px-4 py-2 rounded ${!showLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                }`}
            >
              Register
            </button>
          </div>

          {showLogin ? (
            <Login />
          ) : (
            <Register />
          )}
        </div>
      </div>
    </OpenRoute>
  );
}
