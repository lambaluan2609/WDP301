import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authData = await auth();
    const { userId } = authData;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }

    const { chapterId, content, parentId } = body;

    if (!chapterId || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const comment = await db.comment.create({
      data: {
        userId,
        chapterId,
        content,
        parentId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("[COMMENT ERROR]", error?.message || error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    if (!chapterId) {
      return new NextResponse("Missing chapterId", { status: 400 });
    }

    const comments = await db.comment.findMany({
      where: {
        chapterId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("[COMMENT GET ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    const userId = session.userId;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    const comment = await db.comment.findUnique({ where: { id } });
    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.comment.delete({ where: { id } });

    return new NextResponse("Comment deleted", { status: 200 });
  } catch (error) {
    console.error("[COMMENT DELETE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const authData = await auth();
    const { userId } = authData;
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!body || typeof body !== "object") {
      return new NextResponse("Invalid JSON payload", { status: 400 });
    }

    const { id, content } = body;

    if (!id || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const comment = await db.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return new NextResponse("Comment not found", { status: 404 });
    }

    if (comment.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedComment = await db.comment.update({
      where: { id },
      data: { content },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("[COMMENT UPDATE ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
