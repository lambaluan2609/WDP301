import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentsId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId, attachmentsId } = await params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.findUnique({
      where: {
        id: attachmentsId,
        courseId: courseId,
      },
    });

    if (!attachment) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    await db.attachment.delete({
      where: {
        id: attachmentsId,
      },
    });

    return new NextResponse("Attachment deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
