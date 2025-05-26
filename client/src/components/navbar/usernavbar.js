"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserNavbar() {
    const router = useRouter();
    const { setIsAuthenticated, setUserType, setUser, user } = useAuth();
    const handleLogout = () => {
        // Clear any auth token or user data here
        setIsAuthenticated(false);
        setUserType("");
        setUser([]);
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        router.push("/"); // Redirect to login
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push("/dashboard/user")}
                        className="hover:text-yellow-300 transition"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => router.push("/ranking")}
                        className="hover:text-yellow-300 transition"
                    >
                        Ranking
                    </button>
                </div>
                <div className="flex gap-4">
                    <h2>{user.name}</h2>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
