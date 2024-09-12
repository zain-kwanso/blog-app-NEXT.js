"use client";

import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/authContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
