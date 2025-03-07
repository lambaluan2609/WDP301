import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { redirect } from "next/navigation";

const { video: Video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  context: { params: { courseId: string } }
) {
  try {
    const { params } = context;
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      redirect("/not-found");
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        try {
          await Video.assets.delete(chapter.muxData.assetId);
        } catch (muxError) {
          console.warn(
            `Error when delete Mux asset ${chapter.muxData.assetId}:`,
            muxError
          );
        }
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.error("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: { courseId: string } }
) {
  try {
    const { params } = context;
    const { userId } = await auth();
    const { courseId } = await params;
    const values = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("[COURSE_ID_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
