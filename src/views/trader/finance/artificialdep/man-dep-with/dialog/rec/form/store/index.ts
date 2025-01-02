import { defineStore } from "pinia";
import { api } from "../api";

const useFamRecStore = defineStore({
  id: "famRec",
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
    },
    async qtBtch(params) {
      try {
        const response = await api.qtBtch(params);
        return response;
      } catch (error) {
        console.error("退出失败:", error);
        throw error;
      }
    }
  }
});

export function useFamRec() {
  return useFamRecStore();
}
