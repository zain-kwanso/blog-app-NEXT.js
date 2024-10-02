import { gql, useMutation } from "@apollo/client";
import { Post } from "../../@types/post";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      success
      message
      post {
        id
        title
        content
      }
    }
  }
`;

const useCreatePost = () => {
  const [createPostMutation, { loading, error }] =
    useMutation(CREATE_POST_MUTATION);

  const createPost = async (title: string, content: string): Promise<Post> => {
    try {
      const { data } = await createPostMutation({
        variables: { title, content },
      });

      if (!data.createPost.success) {
        throw new Error(data.createPost.message);
      }

      return data.createPost.post;
    } catch (err) {
      console.error("Error creating post:", err);
      throw new Error("Failed to create post");
    }
  };

  return { createPost, loading, error };
};

export default useCreatePost;
