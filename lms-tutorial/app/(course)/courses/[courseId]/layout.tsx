import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";

export const revalidate = 0;

const CourseLayout = async ({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode;
  params: { courseId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const timestamp =
    searchParams && "ts" in searchParams ? searchParams.ts : undefined;

  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: courseId,
      },
    },
  });

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  console.log(`[COURSE_LAYOUT] Progress count: ${progressCount}%`);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          purchase={!!purchase}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
