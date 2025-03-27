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
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);

  const topLevelComments = commentsList.filter((c) => c.parentId === null);
  const repliesMap = commentsList.reduce((acc, comment) => {
    if (comment.parentId) {
      if (!acc[comment.parentId]) {
        acc[comment.parentId] = [];
      }
      acc[comment.parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);



  const handleUpdateComment = async (id: string, newContent: string) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, content: newContent }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to update comment");
      }
  
      setCommentsList((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, content: newContent } : comment
        )
      );
    } catch (error) {
      console.error("Failed to update comment", error);
    }
  };
  
  const handleDeleteComment = async (id: string) => {
    try {
      const res = await fetch(`/api/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete comment: ${text}`);
      }
  
      setCommentsList((prev) => prev.filter((comment) => comment.id !== id));
    } catch (error) {
      console.error("Failed to delete comment", error);
    }
  };
  
  
  
  
  

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
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
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
        {commentsList.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          renderComments(topLevelComments)
        )}
      </div>
    </div>
  );
};

export default CommentSection;
