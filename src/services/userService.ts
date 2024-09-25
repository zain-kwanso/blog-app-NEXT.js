// src/services/userService.ts
import User from "@/database/models/user.model";

export const getUsers = async () => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email"],

      raw: true,
      logging: console.log,
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch user data.");
  }
};

export const deleteUserById = async (userId: number) => {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await user.destroy();

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};
