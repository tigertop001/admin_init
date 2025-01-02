import { defineStore } from "pinia";
import { api } from "../api";

const useAwdStore = defineStore({
  id: "actAwd",

  state: () => ({}),

  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error;
      }
    },
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    },
    async cxl(params) {
      try {
        const response = await api.cxl(params);
        return response;
      } catch (error) {
        console.error("取消失败:", error);
        throw error;
      }
    },
    async diyCxl(params) {
      try {
        const response = await api.diyCxl(params);
        return response;
      } catch (error) {
        console.error("取消失败:", error);
        throw error;
      }
    }
  }
});

export function useAwd() {
  return useAwdStore();
}
