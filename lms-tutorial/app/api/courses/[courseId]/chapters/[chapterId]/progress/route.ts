import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ProgressRecord {
  userId: string;
  chapterId: string;
  isCompleted: boolean;
  timestamp: Date;
}

const memoryProgressStore = new Map<string, ProgressRecord>();

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = params;
    if (!courseId || !chapterId) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    const requestBody = await req.json();
    const { isCompleted } = requestBody;
    if (typeof isCompleted !== "boolean") {
      return new NextResponse("isCompleted must be a boolean", { status: 400 });
    }

    console.log("[PROGRESS_API] Processing request", {
      userId,
      courseId,
      chapterId,
      isCompleted,
    });

    const progressKey = `${userId}_${chapterId}`;

    const progressRecord: ProgressRecord = {
      userId,
      chapterId,
      isCompleted,
      timestamp: new Date(),
    };

    memoryProgressStore.set(progressKey, progressRecord);

    console.log(
      `[PROGRESS_API] Saved to memory store: key=${progressKey}`,
      progressRecord
    );

    try {
      const chapter = await db.chapter.findUnique({
        where: { id: chapterId },
      });

      if (!chapter) {
        console.log("[PROGRESS_API] Chapter not found:", chapterId);
        return new NextResponse("Chapter not found", { status: 404 });
      }

      const existingProgress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
      });

      let userProgress;

      if (existingProgress) {
        userProgress = await db.userProgress.update({
          where: {
            id: existingProgress.id,
          },
          data: {
            isCompleted,
          },
        });
        console.log("[PROGRESS_API] Updated in database:", userProgress);
      } else {
        userProgress = await db.userProgress.create({
          data: {
            userId,
            chapterId,
            isCompleted,
          },
        });
        console.log("[PROGRESS_API] Created in database:", userProgress);
      }

      return NextResponse.json(userProgress);
    } catch (dbError) {
      console.log(
        "[PROGRESS_API] Database error:",
        dbError instanceof Error ? dbError.message : String(dbError)
      );

      const mockProgress = {
        id: `memory_${Date.now()}`,
        userId,
        chapterId,
        isCompleted,
        createdAt: progressRecord.timestamp,
        updatedAt: progressRecord.timestamp,
      };

      return NextResponse.json(mockProgress);
    }
  } catch (error) {
    console.log(
      "[PROGRESS_API] Unhandled error:",
      error instanceof Error ? error.message : String(error)
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { chapterId } = params;
    if (!chapterId) {
      return new NextResponse("Missing chapterId", { status: 400 });
    }

    const progressKey = `${userId}_${chapterId}`;

    try {
      const dbProgress = await db.userProgress.findUnique({
        where: {
          userId_chapterId: {
            userId,
            chapterId,
          },
        },
      });

      if (dbProgress) {
        return NextResponse.json(dbProgress);
      }
    } catch (dbError) {
      console.log(
        "[PROGRESS_API] Database lookup error:",
        dbError instanceof Error ? dbError.message : String(dbError)
      );
    }

    const memoryProgress = memoryProgressStore.get(progressKey);
    if (memoryProgress) {
      const result = {
        id: `memory_${Date.now()}`,
        userId: memoryProgress.userId,
        chapterId: memoryProgress.chapterId,
        isCompleted: memoryProgress.isCompleted,
        createdAt: memoryProgress.timestamp,
        updatedAt: memoryProgress.timestamp,
      };
      return NextResponse.json(result);
    }

    return new NextResponse("Progress not found", { status: 404 });
  } catch (error) {
    console.log(
      "[PROGRESS_API] GET error:",
      error instanceof Error ? error.message : String(error)
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
