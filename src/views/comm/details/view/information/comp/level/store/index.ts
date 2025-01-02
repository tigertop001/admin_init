import { defineStore } from "pinia";
import { api } from "../api";

const useInfoLevelStore = defineStore({
  id: "infoLevel",
  state: () => ({}),
  actions: {
    async up(params) {
      try {
        let response = await api.up(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    }
  }
});

export function useInfoLevel() {
  return useInfoLevelStore();
}
