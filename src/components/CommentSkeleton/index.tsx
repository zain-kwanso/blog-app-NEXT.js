import React from "react";

const CommentSkeleton: React.FC = (): React.JSX.Element => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      <div className="ml-8 space-y-2">
        <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/5"></div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
