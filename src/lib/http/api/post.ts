import { Message } from "../../../interfaces/messages";
import { PaginationResult } from "../../../interfaces/pagination-result";
import { Post } from "../../../models/post";
import { api } from "../client";

export interface CreatePostDto {
  title: string;
  content: string;
  author: string;
}

export interface FindPostDto {
  author?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  title?: string;
}

const baseUrl = "/post";

export async function create(createPostDto: CreatePostDto): Promise<Message> {
  return api.post(baseUrl, createPostDto).then((res) => res.data);
}

export async function findMany(
  findPostDto: FindPostDto
): Promise<PaginationResult<Post>> {
  return api.get(baseUrl, { params: findPostDto }).then((res) => res.data);
}
