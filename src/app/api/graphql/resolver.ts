import { signinResolver, signupResolver } from "@/resolvers/auth";
import {
  createCommentResolver,
  deleteCommentResolver,
  getPostCommentsResolver,
} from "@/resolvers/commentResolvers";
import {
  createPostResolver,
  deletePostResolver,
  getAllPostsResolver,
  getSinglePostResolver,
  updatePostResolver,
} from "@/resolvers/postResolvers";

export const resolvers = {
  Query: {
    posts: getAllPostsResolver,
    post: getSinglePostResolver,
    postComments: getPostCommentsResolver,
  },

  Mutation: {
    // Post
    createPost: createPostResolver,
    updatePost: updatePostResolver,
    deletePost: deletePostResolver,

    // Comments
    createComment: createCommentResolver,
    deleteComment: deleteCommentResolver,

    //signin
    signin: signinResolver,
    signup: signupResolver,
  },
};
