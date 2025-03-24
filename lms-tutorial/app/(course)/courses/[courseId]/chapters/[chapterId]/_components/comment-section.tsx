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
  parentId: string | null;
}

interface CommentSectionProps {
  chapterId: string;
  comments: Comment[];
}

const CommentSection = ({ chapterId, comments }: CommentSectionProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useUser();

  const topLevelComments = comments.filter((c) => c.parentId === null);
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const renderComments = (commentsToRender: Comment[]) => {
    return commentsToRender.map((comment) => (
      <div key={comment.id}>
        <CommentItem
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
          replies={(repliesMap[comment.id] || []).map((reply) => ({
            ...reply,
            userName: user?.fullName || "Anonymous User",
          }))}
        />
      </div>
    ));
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>

      <div className="border rounded-md p-4">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          renderComments(topLevelComments)
        )}
      </div>
    </div>
  );
};

export default CommentSection;
