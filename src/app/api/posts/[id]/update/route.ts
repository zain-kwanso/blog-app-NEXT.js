import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/validation/validateData";
import { postValidationSchema } from "@/validation/validationSchema";
import { updatePost } from "@/services/postService";
import { getUserAction } from "@/app/actions/auth";

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
  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const validationResponse = await validateRequest(req, postValidationSchema);
  if (!validationResponse.isValid) {
    return NextResponse.json(
      { errors: validationResponse.errors },
      { status: 400 }
    );
  }

  const { title, content } = validationResponse.body;

  try {
    const updatedPost = await updatePost(
      postId,
      title,
      content,
      sessionUser?.id!
    );

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
}
