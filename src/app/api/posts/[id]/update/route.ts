import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validateRequest";
import { postCreationSchema } from "@/utils/validators";
import { updatePost } from "@/services/postService";

export async function PUT(
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

  const validationResponse = await validateRequest(req, postCreationSchema);
  if (!validationResponse.isValid) {
    return NextResponse.json(
      { errors: validationResponse.errors },
      { status: 400 }
    );
  }

  const { title, content } = validationResponse.body;

  try {
    const updatedPost = await updatePost(postId, title, content, user?.id!);

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
}
