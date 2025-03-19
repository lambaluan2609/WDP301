import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const CourseIdPage = async ({
  params,
  searchParams,
}: {
  params: { courseId: string };
  searchParams: { success?: string };
}) => {
  const awaitedParams = await params;
  const { courseId } = awaitedParams;

  // Đảm bảo searchParams được awaited trước khi sử dụng
  const awaitedSearchParams = await searchParams;
  const success = awaitedSearchParams.success === "1";

  const { userId } = await auth();

  // Nếu success=1 và có userId, kiểm tra lại dữ liệu purchase
  if (success && userId) {
    // Kiểm tra xem đã có bản ghi purchase trong DB chưa
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    // Nếu chưa có purchase, tạo mới (phòng trường hợp webhook chưa chạy)
    if (!purchase) {
      try {
        await db.purchase.create({
          data: {
            userId,
            courseId,
          },
        });
        console.log(
          `[COURSE_PAGE] Created purchase for userId=${userId}, courseId=${courseId}`
        );
      } catch (error) {
        console.error("Failed to create purchase:", error);
      }
    }
  }

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
        },
      },
    },
  });

  if (!course || !course.chapters.length) {
    return redirect("/");
  }

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
};

export default CourseIdPage;
