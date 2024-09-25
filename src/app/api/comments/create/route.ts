import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/validation/validateData";
import { createCommentService } from "@/services/commentService";
import { commentSchema } from "@/validation/validationSchema";
import { getUserAction } from "@/app/actions/auth";

export async function POST(req: NextRequest) {
  const sessionUser = await getUserAction();
  if (!sessionUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 401 });
  }

  const { isValid, body, errors } = await validateRequest(req, commentSchema);
  if (!isValid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { content, PostId, ParentId } = body;

  try {
    const comment = await createCommentService(
      sessionUser?.id!,
      PostId,
      content,
      ParentId
    );

    if (!comment) {
      return NextResponse.json(
        { error: "PostId not valid or ParentId does not match PostId" },
        { status: 400 }
      );
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
