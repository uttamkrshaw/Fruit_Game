"use client";
import OpenRoute from "@/components/routes/openroutes";
import { useState } from "react";
import Login from "@/components/login";
import Register from "@/components/register";

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
