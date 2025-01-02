import { defineStore } from "pinia";
import { api } from "../api";

const useFamDSStore = defineStore({
  id: "famDS",

  state: () => ({}),

  actions: {
    async cfm(params) {
      try {
        const response = await api.cfm(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error;
      }
    }
  }
});

export function useFamDS() {
  return useFamDSStore();
}
