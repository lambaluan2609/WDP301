"use client";

import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import toast from "react-hot-toast";
import axios from "axios";

interface VideoPlayerProps {
  playbackId?: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

export const VideoPlayer = ({
  playbackId,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        console.log(
          `[VIDEO_PLAYER] Video ended: Marking chapter ${chapterId} as completed`
        );

        const response = await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          },
          {
            timeout: 5000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("[VIDEO_PLAYER] Progress update response:", response.data);

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");

        const timestamp = Date.now();

        router.refresh();

        setTimeout(() => {
          if (nextChapterId) {
            router.push(
              `/courses/${courseId}/chapters/${nextChapterId}?ts=${timestamp}`
            );
          } else {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set("ts", timestamp.toString());
            router.replace(currentUrl.toString());
          }
        }, 500);
      }
    } catch (error) {
      console.error("[VIDEO_PLAYER] Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="h-[500px] bg-slate-800"></div>;

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && playbackId && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          onError={(error) => {
            console.error("[VIDEO_PLAYER] MuxPlayer Error:", error);
            toast.error(
              "There was an error playing the video. Please try again!"
            );
          }}
          autoPlay
          playbackId={playbackId}
        />
      )}
    </div>
  );
};
