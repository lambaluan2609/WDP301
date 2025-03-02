import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    const awaitedParams = await params;
    const { courseId } = awaitedParams;

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",	
                } 
            }
        }
    });

    if (!course || !course.chapters.length) {
        return redirect("/");
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
