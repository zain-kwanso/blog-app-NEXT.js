import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { deleteCommentService } from "@/services/commentService";
import { getUserAction } from "@/app/actions/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = parseInt(params.id, 10);

  if (isNaN(commentId) || commentId <= 0) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await deleteCommentService(
      commentId,
      sessionUser?.id!,
      sessionUser?.isAdmin!
    );

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
