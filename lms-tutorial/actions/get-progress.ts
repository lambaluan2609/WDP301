import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    if (!userId || !courseId) {
      console.log("[GET_PROGRESS] Missing required data:", {
        userId,
        courseId,
      });
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

    console.log(
      "[GET_PROGRESS] Found published chapters:",
      publishedChapters.length
    );

    if (!publishedChapters.length) {
      console.log("[GET_PROGRESS] No published chapters found");
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

    console.log(
      "[GET_PROGRESS] Completed chapters from DB:",
      validCompletedChapters,
      "out of",
      publishedChapters.length
    );

    const progressPercentage =
      (validCompletedChapters / publishedChapters.length) * 100;
    const roundedProgress = Math.round(progressPercentage);

    console.log(
      "[GET_PROGRESS] Final progress percentage:",
      roundedProgress,
      "%"
    );

    return roundedProgress;
  } catch (error) {
    console.log(
      "[GET_PROGRESS] Error calculating progress:",
      error instanceof Error ? error.message : String(error)
    );
    return 0;
  }
};
