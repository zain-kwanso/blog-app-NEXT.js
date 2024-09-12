import { PostResponse } from "../../@types/post";
import { url, backend_url } from "@/utils/URL";
import axios from "axios";

const fetchPost = async (postId: number): Promise<PostResponse | null> => {
  try {
    const response = await axios.get<PostResponse>(
      backend_url + `${url.posts}/${postId}`
    );

    return response.data;
  } catch (err) {
    console.error("Failed to load post", err);
    return null;
  }
};

export default fetchPost;
