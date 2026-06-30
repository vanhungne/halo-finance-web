import { instance } from "../instance";


export const getListSystemConfigApi = async (query) => {
  const response = await instance.get(`/admin/system-config`, {params: query});
  return response.data;
};

export const updateSystemConfigApi = async (param) => {
  const response = await instance.put("/admin/system-config", null, {
    params: param,
  });
  return response.data;
};

