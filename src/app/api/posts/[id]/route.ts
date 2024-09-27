import { NextRequest, NextResponse } from "next/server";
import { getPostService } from "@/services/postService";

export async function GET(
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

  try {
    const post = await getPostService(postId);

    return NextResponse.json(post, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const status = errorMessage === "Post not found" ? 404 : 500;
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
