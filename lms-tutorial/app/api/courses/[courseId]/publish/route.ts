import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NodeNextRequest } from "next/dist/server/base-http/node";
export async function PATCH (
    req: Request,
    { params } : { params: { courseId: string} }
) {
    try {
        const { userId } =  await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status:401});
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
                    }
                }
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const hasPublishChapter = course.chapters.some((chapter) => chapter.isPublished);

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishChapter) {
            return new NextResponse("Missing required fields", { status: 401});
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[  COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}