import { defineStore } from "pinia";
import { api } from "../api";

const useOpNctlStore = defineStore({
  id: "opNctl",
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
        console.error("新增失败:", error);
        throw error;
      }
    },
    async rec(params) {
      try {
        const response = await api.rec(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    }
  }
});

export function useOpNctl() {
  return useOpNctlStore();
}
