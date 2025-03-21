"use client";

import { useState } from "react";
import { CommentItem } from "./comment-item";
import { useUser } from "@clerk/nextjs";

interface Comment {
  id: string;
  userId: string;
  chapterId: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  chapterId: string;
  comments: Comment[];
}

const CommentSection = ({ chapterId, comments }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useUser();

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <div className="border rounded-md">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500 p-4">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              id={comment.id}
              content={comment.content}
              createdAt={comment.createdAt}
              isReplying={replyingTo === comment.id}
              onReplyClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              showReplyForm={replyingTo === comment.id}
              chapterId={chapterId}
              userId={comment.userId}
              userName={user?.fullName || "Anonymous User"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
