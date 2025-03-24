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

    const { chapterId, courseId, timestamp, text } = await req.json();

    if (!chapterId || !courseId || timestamp === undefined || !text) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const note = await db.note.create({
      data: {
        userId,
        chapterId,
        courseId,
        timestamp,
        text,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
