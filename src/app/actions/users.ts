"use server";

import User from "@/database/models/user.model";
import { getUserAction } from "./auth";

export const fetchUsersAction = async () => {
  try {
    const sessionUser = await getUserAction();

    if (!sessionUser) {
      return { error: "Invalid session.", status: 401 };
    }

    if (!sessionUser.isAdmin) {
      return { error: "Access denied. Admins only.", status: 403 };
    }

    const users = await User.findAll({
      attributes: ["id", "name", "email"],
      raw: true,
    });

    return { data: users, status: 200 };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      error: "Failed to fetch user data. Please try again later.",
      status: 500,
    };
  }
};
