import { defineStore } from "pinia";
import { api } from "../api";

const useActCntStore = defineStore({
  id: "actCnt",
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
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("获取详情失败:", error);
        throw error;
      }
    }
  }
});

export function useActCnt() {
  return useActCntStore();
}
