import { instance } from "../instance";

export const createBlogApi = async (data) => {
  const response = await instance.post("/blog", data);
  return response.data;
};

export const updateBlogApi = async (id, data) => {
  const response = await instance.put(`/blog/${id}`, data);
  return response.data;
};

export const uploadBlogImageApi = async (data) => {
  const response = await instance.post("/blog/upload-image", data);
  return response.data;
};

export const getBlogDetailApi = async (id) => {
  const response = await instance.get(`/blog/${id}`);
  return response.data;
};

export const getListBlogApi = async (query) => {
  const response = await instance.get("/blog", { params: query });
  return response.data;
};

export const deleteBlogApi = async (id) => {
  const response = await instance.delete(`/blog/${id}`);
  return response.data;
};