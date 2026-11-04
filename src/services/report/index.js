import { instance } from "../instance";

export const relyReportApi = async (data) => {
  const response = await instance.patch("/report/reply", data);
  return response.data;
};

export const getReportTypeApi = async () => {
  const response = await instance.get(`/report/type`);
  return response.data;
};

export const getListReportApi = async (query, { signal } = {}) => {
  const response = await instance.get("/report", { signal, timeout: 20_000, params: query });
  return response.data;
};
