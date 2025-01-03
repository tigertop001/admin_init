import { defineStore } from "pinia";
import { api } from "../api";

const usePfinStore = defineStore({
  id: "pfin",
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
    async mpt() {
      try {
        const response = await api.mpt();
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
export function usePfin() {
  return usePfinStore();
}
