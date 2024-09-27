import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, getPostsByUser } from "@/services/postService";
import { getCurrentUser } from "@/app/actions/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const search = searchParams.get("search") || "";
  const userId = searchParams.get("userId");

  if (userId) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Session doesn't exist" },
        { status: 403 }
      );
    }

    if (currentUser?.id !== parseInt(userId, 10)) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    try {
      const {
        rows: posts,
        totalPages,
        nextPage,
        previousPage,
      } = await getPostsByUser(parseInt(userId, 10), page, limit, search);

      return NextResponse.json(
        {
          posts,
          pagination: {
            currentPage: page,
            totalPages,
            nextPage,
            previousPage,
          },
        },
        { status: 200 }
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  }

  try {
    const {
      rows: posts,
      totalPages,
      nextPage,
      previousPage,
    } = await getAllPosts(page, limit, search);

    return NextResponse.json(
      {
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          nextPage,
          previousPage,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
