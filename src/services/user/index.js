import { instance } from "../instance";

export const getListUserApi = async (query) => {
  const response = await instance.get("/account", { params: query });
  return response.data;
};