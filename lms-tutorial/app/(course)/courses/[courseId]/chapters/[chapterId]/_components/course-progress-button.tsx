"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      // Ghi log thông tin request
      const requestData = { isCompleted: !isCompleted };
      console.log(`[PROGRESS_BUTTON] Sending update request:`, {
        chapterId,
        courseId,
        data: requestData,
      });

      const response = await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        requestData,
        {
          timeout: 5000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[PROGRESS_BUTTON] API response:", response.data);

      // Xử lý thành công
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }

      toast.success("Progress updated");

      // Cập nhật UI
      const timestamp = Date.now();

      // Luôn refresh UI
      router.refresh();

      // Chuyển hướng theo điều kiện
      setTimeout(() => {
        if (!isCompleted && nextChapterId) {
          // Đi đến chapter tiếp theo với timestamp
          router.push(
            `/courses/${courseId}/chapters/${nextChapterId}?ts=${timestamp}`
          );
        } else {
          // Ở lại chapter hiện tại nhưng cập nhật timestamp
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set("ts", timestamp.toString());
          router.replace(currentUrl.toString());
        }
      }, 500);
    } catch (error) {
      console.error("[PROGRESS_BUTTON] Error:", error);

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data;

        console.error("[PROGRESS_BUTTON] API error details:", {
          status,
          data: errorMessage,
        });

        if (status === 403) {
          toast.error("You need to purchase this course to track progress");
        } else if (status === 404) {
          toast.error("Chapter not found");
        } else {
          toast.error(`Error: ${errorMessage || error.message}`);
        }
      } else {
        toast.error("Failed to update progress. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};
