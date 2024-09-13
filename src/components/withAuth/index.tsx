"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/authContext";
import { toast } from "react-toastify";
import { getToken } from "@/utils/authUtils";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const token = getToken();

    const router = useRouter();

    useEffect(() => {
      if (!token) {
        toast.error("Please Login First");
        router.push("/");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
