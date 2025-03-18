import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const { video } = mux;

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const authData = await auth();
    const { userId } = authData;
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return redirect("/not-found");
    }

    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        try {
          await video.assets.delete(existingMuxData.assetId);
        } catch (error: any) {
          if (error.status === 404) {
            console.warn("Mux asset not found, skipping delete.");
          } else {
            console.error("Error deleting Mux asset:", error);
          }
        }

        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }
    }

    await db.chapter.delete({ where: { id: chapterId } });

    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true },
    });

    if (!publishedChapters.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return new NextResponse("Chapter deleted", { status: 200 });
  } catch (error) {
    console.error("[CHAPTER_ID_DELETE] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const authData = await auth();
    const { userId } = authData;
    const { courseId, chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isPublished, ...values } = await req.json();

    const chapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: values,
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        try {
          await video.assets.delete(existingMuxData.assetId);
        } catch (error: any) {
          if (error.status === 404) {
            console.warn("Mux asset not found, skipping delete.");
          } else {
            console.error("Error deleting Mux asset:", error);
          }
        }

        await db.muxData.delete({ where: { id: existingMuxData.id } });
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.error("[COURSES_CHAPTER_ID] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
