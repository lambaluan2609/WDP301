import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@radix-ui/react-separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "@/app/(course)/courses/[courseId]/chapters/[chapterId]/_components/course-progress-button";
import { db } from "@/lib/db";

interface PageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
  searchParams?: {
    success?: string;
  };
}

const ChapterIdPage = async ({ params, searchParams }: PageProps) => {
  const { courseId, chapterId } = await params;
  const awaitedSearchParams = await searchParams;
  const success = awaitedSearchParams?.success === "1";

  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Nếu success=1, kiểm tra và cập nhật purchase nếu cần
  if (success) {
    // Không gọi server action revalidateChapterPath ở đây
    // await revalidateChapterPath(courseId, chapterId);

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
          `[CHAPTER_PAGE] Created purchase for userId=${userId}, courseId=${courseId}`
        );
      } catch (error) {
        console.error("[CHAPTER_PAGE] Failed to create purchase:", error);
      }
    }
  }

  // Vì đã có kiểm tra và cập nhật dữ liệu purchase nếu cần thiết,
  // nên dữ liệu getChapter sẽ trả về kết quả mới nhất
  const {
    chapter,
    attachments,
    nextChapter,
    muxData,
    course,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId || ""}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price ?? 0}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description || ""} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
