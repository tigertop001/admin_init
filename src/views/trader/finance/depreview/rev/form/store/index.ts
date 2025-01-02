import { defineStore } from "pinia";
import { api } from "../api";

const useFdRevStore = defineStore({
  id: "fdRev",

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
    async arrv(params) {
      try {
        const response = await api.arrv(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});

export function useFdRev() {
  return useFdRevStore();
}
