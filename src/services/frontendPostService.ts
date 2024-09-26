import { fetchPostAction } from "@/app/actions/posts";
import { PostResponse } from "../../@types/post";

const fetchPost = async (postId: number): Promise<PostResponse | null> => {
  try {
    const response = await fetchPostAction(postId);

    return response.data;
  } catch (err) {
    console.error("Failed to load post", err);
    return null;
  }
};

export default fetchPost;
