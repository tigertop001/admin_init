import { defineStore } from "pinia";
import { api } from "../api";

const useSsWihitStore = defineStore({
  id: "ssWihit",
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
    },
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("获取账号信息失败:", error);
        throw error;
      }
    }
  }
});

export function useSsWihit() {
  return useSsWihitStore();
}
