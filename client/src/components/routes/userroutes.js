"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserRoute({ children }) {
  const { isAuthenticated,userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/");
    }else if(userType!=='User' && userType === 'Admin'){
        router.push("/dashboard/admin")
    }
  }, [isAuthenticated]);

  // You can also show a loading spinner until auth is checked
//   if (isAuthenticated === false) return null;

  return children;
}
