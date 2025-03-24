import { db } from "@/lib/db";

interface GetCommentsProps {
  chapterId: string;
}

export const getComments = async ({ chapterId }: GetCommentsProps) => {
  try {
    await db.$connect();
    const comments = await db.comment.findMany({
      where: { chapterId },
      orderBy: { createdAt: "asc" },
    });

    return comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("[GET_COMMENTS]", error);
    return [];
  }
};

