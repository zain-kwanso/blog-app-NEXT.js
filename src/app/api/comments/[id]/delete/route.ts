import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { deleteCommentService } from "@/services/commentService";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const commentId = parseInt(params.id, 10);

  if (isNaN(commentId) || commentId <= 0) {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const tokenVerification = await verifyToken(req);
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 401 }
    );
  }

  const { user } = tokenVerification;

  try {
    const result = await deleteCommentService(
      commentId,
      user?.id!,
      user?.isAdmin!
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
