import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    if (!userId || !courseId) {
      return 0;
    }

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    if (!publishedChapters.length) {
      return 0;
    }

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapters.map((chapter) => chapter.id),
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;
    const roundedProgress = Math.round(progressPercentage);

    return roundedProgress;
  } catch (error) {
    return 0;
  }
};
