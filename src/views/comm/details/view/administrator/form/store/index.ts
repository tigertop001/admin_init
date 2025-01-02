import { defineStore } from "pinia";
import { api } from "../api";

const useAdminStore = defineStore({
  id: "admin",
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
    }
  }
});

export function useAdmin() {
  return useAdminStore();
}
