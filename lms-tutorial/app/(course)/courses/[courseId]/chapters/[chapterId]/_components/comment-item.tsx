// components/comments/comment-item.tsx

import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import CommentForm from "./comment-form";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  isReplying: boolean;
  onReplyClick: () => void;
  showReplyForm: boolean;
  chapterId: string;
  userId: string;
}

export const CommentItem = ({
  id,
  content,
  createdAt,
  isReplying,
  onReplyClick,
  showReplyForm,
  chapterId,
  userId,
}: CommentItemProps) => {
  return (
    <div className="flex gap-3 p-4 border-b">
      <div className="w-9 h-9 rounded-full bg-gray-300" />
      <div className="flex-1">
        <div
          className="text-sm text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
          <button onClick={onReplyClick} className="flex items-center gap-1 hover:underline text-blue-500">
            <MessageSquare className="w-4 h-4" />
            Reply
          </button>
        </div>

        {showReplyForm && (
          <div className="mt-4 ml-4">
            <CommentForm chapterId={chapterId} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};
