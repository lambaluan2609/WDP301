import { db } from "@/lib/db";
import { Chapter, Attachment } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    const course = await db.course.findUnique({
      where: { id: courseId },
      select: { price: true, isPublished: true },
    });

    if (!course || !course.isPublished) {
      throw new Error("Course not found or not published");
    }

    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, isPublished: true },
    });

    if (!chapter) {
      throw new Error("Chapter not found or not published");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: { courseId },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: { chapterId: chapter.id },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          position: { gt: chapter.position },
        },
        orderBy: { position: "asc" },
      });
    }

    const userProgress = await db.userProgress.findFirst({
      where: { userId, chapterId },
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.error("[GET_CHAPTER]", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
