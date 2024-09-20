import React from "react";
import { Post, PostResponse } from "../../../@types/post";

// Define the props for PostCard
interface PostCardProps {
  post: PostResponse;
  onClick: (post: PostResponse) => void;
  onDelete: (id: number) => void;
  onEdit: (post: Post) => void;
  isUserPost: boolean;
  isAdmin: boolean;
  deleteLoading: boolean;
}

// Utility function to truncate text
const truncateText = (text: string, maxLength: number = 100): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

// Utility function to transform post data
const transformPostData = (post: PostResponse) => ({
  id: post.id,
  title: post.title || "",
  content: post.content || "",
  authorName: post?.User?.name || "",
  userId: post?.UserId,
});

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  onDelete,
  onEdit,
  isUserPost,
  isAdmin,
  deleteLoading,
}): React.JSX.Element => {
  const { title, content, authorName, id, userId } = transformPostData(post);
  return (
    <div
      onClick={() => onClick(post)}
      className="bg-white p-4 rounded-lg shadow-lg w-full cursor-pointer hover:shadow-2xl transition-shadow"
      role="button"
      aria-label={`View post titled ${title}`}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>

      <p className="text-gray-700">{truncateText(content!, 100)}</p>

      <p className="text-gray-500 text-sm mt-2">Posted by {authorName}</p>

      <div className="mt-4 flex justify-end space-x-2">
        {isUserPost && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Edit
          </button>
        )}
        {(isUserPost || isAdmin) && (
          <button
            disabled={deleteLoading}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id!);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
