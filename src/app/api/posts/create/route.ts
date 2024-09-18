import { verifyToken } from "@/middleware/auth";
import { validateRequest } from "@/middleware/validateRequest";
import { createPost } from "@/services/postService";
import { postCreationSchema } from "@/utils/validators";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    const newPost = await createPost(title, content, user?.id!);

    return NextResponse.json(newPost, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
}
