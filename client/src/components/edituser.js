"use client";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { apiurl } from "@/defaults/apiurl";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editUserSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email({ message: "Invalid email address" }),
    profile: z
        .any()
        .optional()
        .refine((file) => file[0]?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

export default function EditUserModal({ isOpen, onClose, user }) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: "",
            email: "",
        }
    });

    useEffect(() => {
        if (user) {
            setValue("name", user.name || "");
            setValue("email", user.email || "");
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        const token = localStorage.getItem('token');

        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.password) formData.append("password", data.password);
        if (data.profile?.[0]) formData.append("profile", data.profile[0]);

        try {
            const response = await axios.patch(`${apiurl}/api/v1/user/edit/${user._id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });

            const res = response.data;
            if (res.status === "success") {
                toast.success(res.message);
                onClose(); // Close modal
                router.refresh();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4 text-black">Edit User</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
                    <div>
                        <label className="block text-lg font-medium text-black">Name</label>
                        <input
                            type="text"
                            {...register("name")}
                            className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-lg font-medium text-black">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-black">Profile Image</label>
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            {...register("profile")}
                            className="w-full p-2 border rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.profile && <p className="text-red-500 text-sm">{errors.profile.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating ..." : "Update"}
                    </button>
                </form>
            </div>
        </div>
    );
}
