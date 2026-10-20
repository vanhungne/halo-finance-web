import { instance } from "../instance";

export const getDefaultCategoryApi = async ({ signal } = {}) => {
  const response = await instance.get("/category/default?PageSize=30", { signal, timeout: 20_000 });
  return response.data;
};
