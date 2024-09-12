import { Post, User } from "@/database/models/associations";
import { Op, Sequelize } from "sequelize";
import { PostResponse } from "../../@types/post";
import axiosInstance from "@/utils/axiosInstance";
import { url } from "@/utils/URL";

//create post service
export const createPost = async (
  title: string,
  content: string,
  userId: number
) => {
  try {
    const newPost = await Post.create({
      title,
      content,
      UserId: userId,
    });
    return newPost;
  } catch (error) {
    console.log(error);
  }
};

//update post service
export const updatePost = async (
  postId: number,
  title: string,
  content: string,
  userId: number
) => {
  const post = await Post.findOne({ where: { id: postId } });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.UserId !== userId) {
    throw new Error("Not authorized to update this post");
  }

  post.title = title;
  post.content = content;

  await post.save();

  return post;
};

//delete post service

export const deletePost = async (
  postId: number,
  userId: number,
  isAdmin: boolean
) => {
  const post = await Post.findOne({ where: { id: postId } });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.UserId !== userId && !isAdmin) {
    throw new Error("Not authorized to delete this post");
  }

  await post.destroy();

  return { message: "Post deleted successfully" };
};

// get post service
export const getPostService = async (postId: number) => {
  const post = await Post.findByPk(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

// Helper function to fetch posts with pagination and search
export const fetchPostsWithPaginationAndSearch = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  userId: number | null = null
) => {
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

  const userCondition = userId ? { UserId: userId } : {};
  const whereCondition = { ...searchCondition, ...userCondition };

  const { count, rows } = await Post.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: User,
        attributes: ["name"],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 ? page - 1 : null;

  return { rows, totalPages, nextPage, previousPage };
};

export const getAllPosts = async (
  page: number,
  limit: number,
  search: string
) => {
  return await fetchPostsWithPaginationAndSearch(page, limit, search);
};

export const getPostsByUser = async (
  userId: number,
  page: number,
  limit: number,
  search: string
) => {
  return await fetchPostsWithPaginationAndSearch(page, limit, search, userId);
};
