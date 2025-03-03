"use client";

import { cn } from "@/lib/utils";
import { Lock, CheckCircle, PlayCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const isActive = pathname?.includes(id);

  const onClick = () => {
    if (isLocked) {
      console.log("Chương này bị khóa, không thể truy cập.");
      return;
    }

    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 py-2 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20",
        isLocked && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon
        size={22}
        className={cn(
          "text-slate-500",
          isActive && "text-slate-700",
          isCompleted && "text-emerald-700"
        )}
      />
      <span>{label}</span>
    </button>
  );
};
