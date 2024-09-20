import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { deleteUserById } from "@/services/userService";

// API to delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = parseInt(params.id, 10);

  if (isNaN(userId) || userId <= 0) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const tokenVerification = await verifyToken(req);
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 401 }
    );
  }

  const { user } = tokenVerification;

  if (!user?.isAdmin) {
    return NextResponse.json(
      { error: "Admin privileges required" },
      { status: 403 }
    );
  }

  if (user.id === userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    const result = await deleteUserById(userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 403 });
    }

    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
