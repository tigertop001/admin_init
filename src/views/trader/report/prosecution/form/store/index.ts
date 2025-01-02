import { defineStore } from "pinia";
import { api } from "../api";

const useRepPorStore = defineStore({
  id: "repPor",
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
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});
export function useRepPor() {
  return useRepPorStore();
}
