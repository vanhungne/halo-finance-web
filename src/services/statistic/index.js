import { instance } from "../instance";

export const getDashboardStatisticApi = async () => {
  const response = await instance.get(`/admin-statistic/dashboard`);
  return response.data;
};

export const getAdvertiseStatisticApi = async () => {
  const response = await instance.get(`/admin-statistic/advertise`);
  return response.data;
};

export const getBlogStatisticApi = async () => {
  const response = await instance.get(`/admin-statistic/blog`);
  return response.data;
};

export const getUserStatisticApi = async () => {
  const response = await instance.get(`/admin-statistic/user`);
  return response.data;
};

export const getReportStatisticApi = async () => {
  const response = await instance.get(`/admin-statistic/report`);
  return response.data;
};

export const getMembershipStatisticApi = async (query) => {
  const response = await instance.get(`/admin-statistic/membership`, {params: query});
  return response.data;
};

export const getRevenueStatisticApi = async (query) => {
  const response = await instance.get(`/admin-statistic/revenue`, {params: query});
  return response.data;
};

