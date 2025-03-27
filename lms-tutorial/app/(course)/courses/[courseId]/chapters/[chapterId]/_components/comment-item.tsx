// components/comments/comment-item.tsx
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Edit, Trash } from "lucide-react";
import CommentForm from "./comment-form";
import { useUser } from "@clerk/nextjs";

interface CommentType {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  userName: string;
}

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: string;
  isReplying: boolean;
  onReplyClick: () => void;
  showReplyForm: boolean;
  chapterId: string;
  userId: string;
  userName: string;
  replies?: CommentType[];
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onReplyAdded?: (newReply: CommentType) => void;
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
  userName,
  replies,
  onUpdate,
  onDelete,
  onReplyAdded,
}: CommentItemProps) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleEdit = async () => {
    if (isEditing) {
      try {
        await onUpdate(id, editContent);
      } catch (error) {
        console.error("Failed to update comment", error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleReplyAdded = (newReply: any) => {
    if (onReplyAdded) {
      onReplyAdded(newReply);
    }
  };

  return (
    <div className="flex gap-3 p-4 border-b">
      <div className="w-9 h-9 rounded-full bg-gray-300">
        <img
          src={user?.imageUrl}
          alt={user?.fullName ?? "Unknown User"}
          className="w-full h-full rounded-full"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{userName}</p>

        {isEditing ? ( // 🔹 Nếu đang chỉnh sửa, hiển thị textarea
          <textarea
            className="w-full p-2 border rounded-md text-sm"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <div
            className="text-sm text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}

        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          <button
            onClick={onReplyClick}
            className="flex items-center gap-1 hover:underline text-blue-500"
          >
            <MessageSquare className="w-4 h-4" />
            Reply
          </button>
          {user?.id === userId && (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 hover:underline text-green-500"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? "Save" : "Edit"}
              </button>
              <button
                onClick={() => onDelete(id)}
                className="flex items-center gap-1 hover:underline text-red-500"
              >
                <Trash className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-4 ml-4">
            <CommentForm
              chapterId={chapterId}
              userId={userId}
              parentId={id}
              onCommentAdded={handleReplyAdded}
            />
          </div>
        )}

        {replies && replies.length > 0 && (
          <div className="mt-4 ml-6 border-l border-gray-200 pl-4 space-y-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                id={reply.id}
                content={reply.content}
                createdAt={reply.createdAt}
                isReplying={false}
                onReplyClick={() => {}}
                showReplyForm={false}
                chapterId={reply.chapterId}
                userId={reply.userId}
                userName={reply.userName}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onReplyAdded={onReplyAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
