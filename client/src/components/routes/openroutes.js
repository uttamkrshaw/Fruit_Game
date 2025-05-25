"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OpenRoute({ children }) {
  const { isAuthenticated, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === true && userType === 'User') {
      router.push("/dashboard/user");
    } else if (isAuthenticated === true && userType === 'Admin') {
      router.push("/dashboard/admin")
    }
  }, [isAuthenticated]);

  // You can also show a loading spinner until auth is checked
  //   if (isAuthenticated === false) return null;

  return children;
}
