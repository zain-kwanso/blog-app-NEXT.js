"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import PublicHeader from "@/components/PublicHeader";
import PrivateHeader from "@/components/PrivateHeader";
import { getToken } from "@/utils/authUtils";

const ClientHeader = () => {
  const { user } = useContext(AuthContext);

  return user ? <PrivateHeader /> : <PublicHeader />;
};

export default ClientHeader;
