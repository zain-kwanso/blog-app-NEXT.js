"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import useCustomNavigation from "@/hooks/useCustomNavigation";

import { getToken } from "@/utils/authUtils";

const withNoAuth = (WrappedComponent: React.ComponentType<any>) => {
  const NonAuthenticatedComponent = (props: any) => {
    const token = getToken();
    const { navigateToHomePage } = useCustomNavigation();

    useEffect(() => {
      if (token) {
        toast.info("You are already logged in.");
        navigateToHomePage();
      }
    }, []);

    return !token ? <WrappedComponent {...props} /> : null;
  };

  return NonAuthenticatedComponent;
};

export default withNoAuth;
