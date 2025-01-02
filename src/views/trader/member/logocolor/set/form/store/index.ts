import { defineStore } from "pinia";
import { api } from "../api";

const useMemLGSetStore = defineStore({
  id: "memLGSet",
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
    async up(params) {
      try {
        const response = await api.up(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    }
  }
});

export function useMemLGSet() {
  return useMemLGSetStore();
}
