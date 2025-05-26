"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiurl } from "@/defaults/apiurl";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];



const registerSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/,
            "Password must include uppercase, lowercase, number, and special character"
        ),
    profile: z
        .any()
        .refine((file) => file[0]?.size <= MAX_FILE_SIZE, "Max image size is 5MB.")
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
            "Only .jpg, .jpeg, .png and .webp formats are supported."
        )
});

export default function Register() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        // Call API or handle authentication here

        const formData = new FormData();
        formData.append("profile", data.profile[0]);
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

        try {
            const response = await axios.post(`${apiurl}/api/v1/user/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            const res = response.data;
            if (res.status === 'success') {
                toast.success(res.message);
                reset()
            } else {
                toast.error(res.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    };
    return (
        <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-lg m-auto">
            <h2 className="text-2xl font-semibold text-center mb-4 text-black">User Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="false">
                <div>
                    <label className="block text-lg font-medium text-black">Name</label>
                    <input
                        type="text"
                        autoFocus={true}
                        {...register("name")}
                        className=" text-black w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-lg font-medium text-black">Email</label>
                    <input
                        type="email"
                        {...register("email")}
                        className=" text-black w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-lg font-medium text-black">Password</label>
                    <input
                        type="password"
                        {...register("password")}
                        className=" text-black w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div>
                    <label className="block text-lg font-medium text-black">Profile Image</label>
                    <input
                        type="file"
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                        {...register("profile")}
                        className=" text-black w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.profile && <p className="text-red-500 text-sm">{errors.profile.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Registering ..." : "Register"}
                </button>
            </form>
        </div>
    );
}
