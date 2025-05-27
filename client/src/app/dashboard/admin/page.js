'use client';

import { useRouter } from "next/navigation";
import axios from "axios";
import AdminRoute from "@/components/routes/adminroutes";
import AdminNavbar from "@/components/navbar/adminnavbar";
import { useEffect, useState } from "react";
import { apiurl } from "@/defaults/apiurl";
import toast from "react-hot-toast";
import EditUserModal from "@/components/edituser";
import io from 'socket.io-client';


export default function Home() {
    const router = useRouter();
    const socket = io(apiurl); // Replace with your backend URL
    const [users, setUsers] = useState([]);
    const [acusers, setAcUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editUsers, setEditUsers] = useState([]);

    const GetUserDetails = async () => {
        try {
            const res = await axios.get(`${apiurl}/api/v1/user/listall/admin`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const response = res.data;
            if (response?.status === 'success') {
                setUsers(response.data)
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }


    const toggleBlockUser = async (data) => {
        const endpoint = data.disabled === true ? "unblock" : "block"
        const url = `${apiurl}/api/v1/user/${endpoint}/${data._id}`
        try {
            const res = await axios.patch(`${url}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const response = res.data;
            if (response?.status === 'success') {
                toast.success(response?.message)
                GetUserDetails()
            } else {
                toast.error(response?.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    const editUser = (user) => {
        setEditUsers(user);
        setModalOpen(!isModalOpen)
    };


    useEffect(() => {
        GetUserDetails()
        socket.on('activeUsers', (userList) => {
            setAcUsers(userList);
        });

        return () => {
            socket.off('activeUsers');
        };

    }, [])


    return (
        <AdminRoute>
            <AdminNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">All User List</h1>
                    <ul className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                            <li
                                key={user._id}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <img
                                        src={user.profile || "https://via.placeholder.com/40"}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            #{index + 1} {user.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{user.score} 🍌</p>
                                    </div>
                                </div>

                                <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
                                    <button
                                        onClick={() => toggleBlockUser(user)}
                                        className={`px-3 py-1 text-sm rounded-md font-medium ${user.disabled
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-red-100 text-red-800 hover:bg-red-200"
                                            } transition`}
                                    >
                                        {user.disabled ? "Unblock" : "Block"}
                                    </button>

                                    <button
                                        onClick={() => editUser(user)}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md font-medium hover:bg-blue-200 transition"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <EditUserModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        user={editUsers}
                    />
                </div>

            </div>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Active User List</h1>
                    <ul className="divide-y divide-gray-200">
                        {acusers.map((user, index) => (
                            <li
                                key={index}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-4 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-center space-x-4 w-full sm:w-auto">
                                    <img
                                        src={user.profile || "https://via.placeholder.com/40"}
                                        alt={user.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />

                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        #{index + 1} {user.name}
                                    </p>
                                    <p className="text-sm text-gray-500">{user.score} 🍌</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </AdminRoute>

    );
}
