import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function Delete(
    req: Request,
    { params }: { params: { courseId: string, attachmentsId: string } }
) {
    try{
        const { userId } = await auth();

        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const attachment = await db.attachment.delete({
            where: {
                courseId: params.courseId,
                id: params.attachmentsId,
            }
        });
        return NextResponse.json(attachment);
    } catch(error) {
        console.error("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}