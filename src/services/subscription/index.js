import { instance } from "../instance";


export const getSubscriptionApi = async (query, { signal } = {}) => {
  const response = await instance.get(`/subscription`, { signal, timeout: 20_000, params: query });
  return response.data;
};
