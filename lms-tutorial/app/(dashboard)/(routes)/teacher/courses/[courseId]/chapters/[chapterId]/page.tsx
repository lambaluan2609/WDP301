import { ChapterDescriptionForm } from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapters/[chapterId]/_components/chapter-description-form";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard, Eye, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const ChapterIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
    chapterId: string;
  };
}) => {
  const authData = await auth();
  const { userId } = authData;

  const { courseId, chapterId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
      courseId: courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
          <Banner
            variant="warning"
            label="This chapter is unpublished. It will not be visible in the course."
          />
        </div>
      )}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between border-b pb-4">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="flex items-center text-sm text-gray-600 hover:opacity-75 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <ChapterActions
            disabled={!isComplete}
            courseId={courseId}
            chapterId={chapterId}
            isPublished={chapter.isPublished}
          />
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Chapter Creation
          </h1>
          <span className="text-sm text-gray-600">
            Complete all fields {completionText}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-medium">
              <IconBadge icon={LayoutDashboard} />
              <h2>Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>

          <div className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <div className="flex items-center gap-2 text-lg font-medium">
              <IconBadge icon={Eye} />
              <h2>Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
        </div>

        <div className="p-4 mt-6 border rounded-lg bg-gray-50 shadow-sm">
          <div className="flex items-center gap-2 text-lg font-medium">
            <IconBadge icon={Video} />
            <h2>Add a video</h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
