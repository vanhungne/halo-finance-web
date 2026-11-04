import { instance } from "../instance";

export const getDashboardStatisticApi = async ({ signal } = {}) => {
  const response = await instance.get(`/admin-statistic/dashboard`, { signal, timeout: 20_000 });
  return response.data;
};

export const getAdvertiseStatisticApi = async ({ signal } = {}) => {
  const response = await instance.get(`/admin-statistic/advertise`, { signal, timeout: 20_000 });
  return response.data;
};

export const getBlogStatisticApi = async ({ signal } = {}) => {
  const response = await instance.get(`/admin-statistic/blog`, { signal, timeout: 20_000 });
  return response.data;
};

export const getUserStatisticApi = async ({ signal } = {}) => {
  const response = await instance.get(`/admin-statistic/user`, { signal, timeout: 20_000 });
  return response.data;
};

export const getReportStatisticApi = async ({ signal } = {}) => {
  const response = await instance.get(`/admin-statistic/report`, { signal, timeout: 20_000 });
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

