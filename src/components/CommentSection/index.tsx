"use client";

import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ReplyComment, CommentType } from "../../../@types/comment";
import useFetchComments from "@/hooks/useFetchComments";
import CommentSkeleton from "../CommentSkeleton";
import useDeleteComment from "@/hooks/useDeleteComment";
import { AuthContext } from "@/context/authContext";
import { toast } from "react-toastify";
import { createCommentAction } from "@/app/actions/comment";

interface CommentsSectionProps {
  postId: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const [replyComment, setReplyComment] = useState<ReplyComment>({});
  const [newComment, setNewComment] = useState<string>("");
  const [newCommentError, setNewCommentError] = useState<string>("");
  const [replyError, setReplyError] = useState<ReplyComment>({});

  const { fetchComments, comments, loading, error } = useFetchComments();

  const { deleteComment } = useDeleteComment();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  const handleAddComment = async (content: string) => {
    if (content.trim() === "") return;
    try {
      const response = await createCommentAction(content, postId);

      if (response.status === 200) {
        fetchComments(postId);
        toast.success("comment added successfully.");
      } else {
        console.error(response?.error);
        toast.error("Failed to add comments.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      fetchComments(postId);
      toast.success("Comment deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment.");
    }
  };

  const handleAddReply = async (
    replyComment: ReplyComment,
    parentId: number
  ) => {
    if (replyComment[parentId]?.trim() === "") return;
    try {
      const response = await createCommentAction(
        replyComment[parentId]!,
        postId,
        parentId
      );
      if (response.status === 200) {
        fetchComments(postId);
        toast.success("comment added successfully.");
      } else {
        console.error(response?.error);
        toast.error("Failed to add comments.");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("ailed to add reply.");
    }
  };

  const handleReplyChange = (parentId: number, value: string) => {
    if (value.length > 255) {
      setReplyError((prev) => ({
        ...prev,
        [parentId]: "Reply cannot exceed 255 characters",
      }));
    } else if (value.trim() === "") {
      setReplyError((prev) => ({
        ...prev,
        [parentId]: "Reply cannot be empty",
      }));
    } else {
      setReplyError((prev) => ({
        ...prev,
        [parentId]: "",
      }));
    }
    setReplyComment((prev) => ({ ...prev, [parentId]: value }));
  };

  const handleCommentChange = (value: string) => {
    if (value.length > 255) {
      setNewCommentError("Comment cannot exceed 255 characters");
    } else if (value.trim() === "") {
      setNewCommentError("Comment cannot be empty");
    } else {
      setNewCommentError("");
    }
    setNewComment(value);
  };

  const renderComments = (
    comments: CommentType[],
    level: number = 0
  ): JSX.Element[] => {
    return comments?.map((comment) => {
      const profilePictureUrl = comment?.User?.profilePictureUrl
        ? comment.User.profilePictureUrl
        : "https://generated.vusercontent.net/placeholder-user.jpg";

      return (
        <div
          key={comment.id}
          className={`ml-${level * 4} mt-2 border-l-2 pl-4`}
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 border rounded-full overflow-hidden">
              <Image
                src={profilePictureUrl}
                alt={`${comment?.User?.name || "User"}'s profile picture`}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
            <div className="grid gap-1">
              <div className="font-bold text-sm text-gray-700">
                {comment?.User?.name || "Anonymous"}
              </div>
              <p className="text-muted-foreground text-sm font-medium">
                {comment?.content}
              </p>
            </div>
          </div>

          {(comment?.UserId === user?.id || user?.isAdmin) && (
            <button
              className="text-red-500 text-xs"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </button>
          )}

          {level < 1 && user && (
            <button
              className="text-blue-500 text-xs ml-2"
              onClick={() =>
                setReplyComment((prev) => ({
                  ...prev,
                  [comment.id]: prev[comment.id] || "",
                }))
              }
            >
              Reply
            </button>
          )}
          {/* Reply Section */}
          {replyComment[comment.id] !== null &&
            level < 1 &&
            replyComment[comment.id] !== undefined && (
              <div className="mt-2">
                <textarea
                  className={`w-full p-2 border rounded text-sm ${
                    replyError[comment.id] ? "border-red-500" : ""
                  }`}
                  value={replyComment[comment.id]!}
                  rows={3}
                  onChange={(e) =>
                    handleReplyChange(comment.id, e.target.value)
                  }
                  placeholder="Add a reply"
                />
                {replyError[comment.id] && (
                  <p className="text-red-500 text-xs mt-1">
                    {replyError[comment.id]}
                  </p>
                )}
                <div className="flex items-center justify-end gap-3">
                  <button
                    className="bg-gray-500 text-white text-xs px-4 py-2 rounded mt-2"
                    onClick={() =>
                      setReplyComment((prev) => ({
                        ...prev,
                        [comment.id]: null,
                      }))
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white text-xs px-4 py-2 rounded mt-2"
                    onClick={() => {
                      if (!replyError[comment.id]) {
                        handleAddReply(replyComment, comment.id);
                        setReplyComment((prev) => ({
                          ...prev,
                          [comment.id]: null,
                        }));
                      }
                    }}
                  >
                    Add Reply
                  </button>
                </div>
              </div>
            )}

          {comment.replies &&
            comment.replies.length > 0 &&
            renderComments(comment.replies, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="mt-12 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <div className="space-y-6">
        <div className="flex-grow overflow-auto mb-4">
          {loading ? (
            <>
              <CommentSkeleton />
            </>
          ) : error ? (
            <p className="text-red-500">Failed to load comments</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            renderComments(comments)
          )}
        </div>
      </div>

      {user && (
        <div className="mt-8">
          <h3 className="text-lg font-bold">Add a comment</h3>
          <div className="mt-4 grid gap-4">
            <div className="grid grid-cols-[48px_1fr] items-start gap-4">
              <div className="w-12 h-12 border rounded-full">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-12 h-12 border">
                  <Image
                    className="aspect-square h-full w-full rounded-full object-cover"
                    alt={user?.name || "User"}
                    src={
                      user?.profilePictureUrl ||
                      "https://generated.vusercontent.net/placeholder-user.jpg"
                    }
                    width={48}
                    height={48}
                  />
                </span>
              </div>

              {/* Comment Text Area and Button */}
              <div className="flex items-end gap-2">
                <textarea
                  className={`w-full p-2 border rounded text-sm ${
                    newCommentError ? "border-red-500" : ""
                  }`}
                  value={newComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder="Add a comment"
                  rows={3}
                />
                <button
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded"
                  onClick={() => {
                    if (!newCommentError) {
                      handleAddComment(newComment);
                      setNewComment("");
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 inline-block rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Display Error Message */}
            {newCommentError && (
              <p className="text-red-500 text-xs mt-1">{newCommentError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
