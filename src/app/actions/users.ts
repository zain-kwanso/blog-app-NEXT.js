"use server";

import User from "@/database/models/user.model";
import { getUserAction } from "./auth";
import { deleteUserById } from "@/services/userService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// get all users server action
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

// delete user server aciton
export const deleteUserAction = async (userId: number) => {
  const sessionUser = await getUserAction();
  if (!sessionUser || !sessionUser.isAdmin) {
    return { error: "You don't have permission to delete users", status: 403 };
  }

  try {
    const result = await deleteUserById(userId);

    if (result.success) {
      revalidatePath("/admin");
      redirect("/admin");
      return { message: "User deleted successfully", status: 200 };
    } else {
      return { error: result.error || "Failed to delete user", status: 500 };
    }
  } catch (error: any) {
    return { error: error.message || "Unknown error", status: 500 };
  }
};
