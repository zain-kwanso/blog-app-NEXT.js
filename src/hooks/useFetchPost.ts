import axios from "axios";
import { PostResponse } from "../../@types/post";
import { backend_url, url } from "@/utils/URL";

const fetchPost = async (postId: number): Promise<PostResponse | null> => {
  try {
    const response = await axios.get<PostResponse>(
      backend_url + url.posts + `/${postId}`
    );

    return response.data;
  } catch (err) {
    console.error("Failed to load post", err);
    return null; // Handle errors by returning null
  }
};

export default fetchPost;
