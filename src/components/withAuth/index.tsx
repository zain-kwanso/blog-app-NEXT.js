"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { getToken } from "@/utils/authUtils";
import useCustomNavigation from "@/hooks/useCustomNavigation";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const token = getToken();
    const { navigateToHomePage } = useCustomNavigation();

    useEffect(() => {
      if (!token) {
        toast.error("Please Login First");
        navigateToHomePage();
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
