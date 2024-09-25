import { getUserAction } from "@/app/actions/auth";
import { verifyToken } from "@/middleware/auth";
import { validateRequest } from "@/validation/validateData";
import { createPost } from "@/services/postService";
import { postValidationSchema } from "@/validation/validationSchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    const newPost = await createPost(title, content, sessionUser?.id!);

    return NextResponse.json(newPost, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, please try again later" },
      { status: 500 }
    );
  }
}
