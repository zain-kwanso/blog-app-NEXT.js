import { NextRequest, NextResponse } from "next/server";
import { getPostCommentsService } from "@/services/commentService";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const postId = parseInt(params.id, 10);

  if (isNaN(postId) || postId <= 0) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const comments = await getPostCommentsService(postId);

    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
