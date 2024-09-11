import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/middleware/auth";
import { getAllPosts, getPostsByUser } from "@/services/postService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "9", 10);
  const search = searchParams.get("search") || "";
  const userId = searchParams.get("userId");

  if (userId) {
    const tokenVerification = await verifyToken(req);
    if (!tokenVerification.isValid) {
      return NextResponse.json(
        { error: tokenVerification.error },
        { status: 403 }
      );
    }

    const { user } = tokenVerification;

    if (user.id !== parseInt(userId, 10) && !user.isAdmin) {
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

      if (posts.length === 0) {
        return NextResponse.json({ error: "No posts found" }, { status: 404 });
      }

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

    if (posts.length === 0) {
      return NextResponse.json({ error: "No posts found" }, { status: 404 });
    }

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
