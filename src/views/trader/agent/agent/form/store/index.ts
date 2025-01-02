import { defineStore } from "pinia";
import { api } from "../api";

const useAgtStore = defineStore({
  id: "agt",
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
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});
export function useAgt() {
  return useAgtStore();
}
