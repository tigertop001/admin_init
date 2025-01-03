import { defineStore } from "pinia";
import { api } from "../api";

const useFfunStore = defineStore({
  id: "ffun",
  state: () => ({}),
  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },
    async mpt(params) {
      try {
        const response = await api.mpt(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    },
    async spt(params) {
      try {
        const response = await api.spt(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});
export function useFfun() {
  return useFfunStore();
}
