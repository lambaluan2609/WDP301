import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";
import NotesSectionWithToggle from "./_components/notes-section-with-toggle";
import { PageProps } from "@/.next/types/app/layout";

interface Chapter {
  id: string;
  title: string;
  description: string;
  isFree: boolean;
}

const ChapterIdPage = async ({ params }: PageProps) => {
  const { courseId, chapterId } = await params;

  interface MuxData {
    playbackId?: string;
  }

  interface Course {
    id: string;
    price?: number;
  }

  interface UserProgress {
    isCompleted?: boolean;
  }

  const ChapterIdPage = async ({
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string }>;
  }) => {
    const resolvedParams = await params;
    const { courseId, chapterId } = resolvedParams;
    const { userId } = await auth();

    if (!userId) {
      return redirect("/");
    }

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
          <Banner
            variant="success"
            label="You already completed this chapter."
          />
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
              playbackId={muxData?.playbackId}
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
              <Preview value={chapter.description} />
            </div>
            <NotesSectionWithToggle
              userId={userId}
              chapterId={chapterId}
              courseId={courseId}
              isLocked={isLocked}
              initialNotesVisible={true}
            />
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
};

export default ChapterIdPage;
