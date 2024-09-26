"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { cache } from "react"; //check cache

export const verifySession = async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return { isAuth: false, userId: session?.userId };
  }

  return { isAuth: true, userId: session.userId };
};
