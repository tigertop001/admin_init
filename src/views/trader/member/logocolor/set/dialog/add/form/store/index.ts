import { defineStore } from "pinia";
import { api } from "../api";

const useMemLogAddStore = defineStore({
  id: "memLogAdd",

  state: () => ({}),

  actions: {
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    }
  }
});

export function useMemLogAdd() {
  return useMemLogAddStore();
}
