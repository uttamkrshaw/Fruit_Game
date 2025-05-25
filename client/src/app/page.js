"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiurl } from "@/defaults/apiurl";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    // Call API or handle authentication here
    fetch(`${apiurl}user/login`, {
      method: 'Post',
      body: JSON.stringify(data),
      headers: {
        "Content-Type": 'application/json'
      }
    }).then((res) => res.json())
      .then((res) => { res.status === 'success' ? (toast.success(res.message), localStorage.setItem('userInfo', JSON.stringify(res.token)), router.push('/chat')) : (toast.error(res.message), console.log("error", res)) })
      .catch((err) => toast.error(err.message))

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md mx-auto p-10 bg-white shadow-md rounded-lg m-auto">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black">User Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="false">
          
          <div>
            <label className="block text-lg font-medium text-black">Email</label>
            <input
              type="email"
              autoFocus={true}
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
