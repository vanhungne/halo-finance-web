import { instance } from "../instance";


export const getSubscriptionApi = async (query) => {
  const response = await instance.get(`/subscription`, {params: query});
  return response.data;
};
