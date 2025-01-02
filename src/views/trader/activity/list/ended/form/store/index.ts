import { defineStore } from "pinia";
import { api } from "../api";

const useAcLstStore = defineStore({
  id: "acLst",

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
    }
  }
});

export function useAcLst() {
  return useAcLstStore();
}
