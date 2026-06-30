import { instance } from "../instance";

export const loginApi = async (data) => {
  const response = await instance.post("/auth/login", data);
  return response.data;
};

export const refreshTokenApi = async (data) => {
  const response = await instance.post("/auth/refresh-token", data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response.data;
};