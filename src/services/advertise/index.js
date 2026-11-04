import { instance } from "../instance";

export const createAdvertiseApi = async (data) => {
  const response = await instance.post("/advertise", data);
  return response.data;
};

export const updateAdvertiseApi = async (id, data) => {
  const response = await instance.put(`/advertise/${id}`, data);
  return response.data;
};

export const getListAdvertiseApi = async (query, { signal } = {}) => {
  const response = await instance.get("/advertise", { signal, timeout: 20_000, params: query });
  return response.data;
};

export const deleteAdvertiseApi = async (id) => {
  const response = await instance.delete(`/advertise/${id}`);
  return response.data;
};

export const changeStatusAdvertiseApi = async (params) => {
  const response = await instance.patch(`/advertise/change-status`, params);
  return response.data;
};
