import { instance } from "../instance";

export const getDefaultCategoryApi = async () => {
  const response = await instance.get("/category/default?PageSize=30");
  return response.data;
};