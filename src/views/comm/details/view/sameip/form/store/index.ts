import { defineStore } from "pinia";
import { api } from "../api";

const useSameIpStore = defineStore({
  id: "sameip",

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

export function useSameIp() {
  return useSameIpStore();
}
