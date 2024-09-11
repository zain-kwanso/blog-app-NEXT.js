import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validateRequest";
import { createCommentService } from "@/services/commentService";
import { commentSchema } from "@/utils/validators";

export async function POST(req: NextRequest) {
  const tokenVerification = await verifyToken(req);
  if (!tokenVerification.isValid) {
    return NextResponse.json(
      { error: tokenVerification.error },
      { status: 401 }
    );
  }

  const { isValid, body, errors } = await validateRequest(req, commentSchema);
  if (!isValid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const { content, PostId, ParentId } = body;
  const { user } = tokenVerification;

  try {
    const comment = await createCommentService(
      user?.id!,
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
