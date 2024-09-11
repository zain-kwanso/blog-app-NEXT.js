import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { deletePost } from "@/services/postService";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id, 10);
  if (isNaN(postId) || postId <= 0) {
    return NextResponse.json(
      { error: "Invalid post ID. It must be a positive integer." },
      { status: 400 }
    );
  }
  const tokenVerification = await verifyToken(req);
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 403 }
    );
  }

  const { user } = tokenVerification;

  try {
    const result = await deletePost(postId, user?.id!, user?.isAdmin!);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const status =
      errorMessage === "Post not found" ||
      errorMessage === "Not authorized to delete this post"
        ? 403
        : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
