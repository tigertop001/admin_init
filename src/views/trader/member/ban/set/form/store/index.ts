import { defineStore } from "pinia";
import { api } from "../api";

const useMemBanSetStore = defineStore({
  id: "memBanSet",

  state: () => ({}),

  actions: {
    async set(params) {
      try {
        const response = await api.set(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },

    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    }
  }
});

export function useMemBanSet() {
  return useMemBanSetStore();
}
