import { defineStore } from "pinia";
import { api } from "../api";

const useMemBanSetStore = defineStore({
  id: "memBanSet",

  state: () => ({}),

  actions: {
    /**
     * 配置
     */
    async set(params) {
      try {
        const response = await api.set(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },

    async del(params) {
      try {
        const response = await api.del(params);
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
