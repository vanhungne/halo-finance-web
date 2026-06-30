import { instance } from "../instance";

export const relyReportApi = async (data) => {
  const response = await instance.patch("/report/reply", data);
  return response.data;
};

export const getReportTypeApi = async (id) => {
  const response = await instance.get(`/report/type`);
  return response.data;
};

export const getListReportApi = async (query) => {
  const response = await instance.get("/report", { params: query });
  return response.data;
};