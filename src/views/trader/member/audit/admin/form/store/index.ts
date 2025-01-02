import { defineStore } from "pinia";
import { api } from "../api";

const useMemAdmStore = defineStore({
  id: "memAdm",

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
    async pass(params) {
      try {
        const response = await api.pass(params);
        return response;
      } catch (error) {
        console.error("通过失败:", error);
        throw error;
      }
    },
    async reject(params) {
      try {
        const response = await api.reject(params);
        return response;
      } catch (error) {
        console.error("驳回失败:", error);
        throw error;
      }
    }
  }
});

export function useMemAdm() {
  return useMemAdmStore();
}
