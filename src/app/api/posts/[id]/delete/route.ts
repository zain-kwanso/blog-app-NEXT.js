import { NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/services/postService";
import { getUserAction } from "@/app/actions/auth";

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
  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await deletePost(
      postId,
      sessionUser?.id!,
      sessionUser?.isAdmin!
    );

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
