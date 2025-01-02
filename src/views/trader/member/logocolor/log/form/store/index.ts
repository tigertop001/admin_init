import { defineStore } from "pinia";
import { api } from "../api";

const useMemLCLogStore = defineStore({
  id: "memBanRec",

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

    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("删除失败:", error);
        throw error;
      }
    }
  }
});

export function useMemLCLog() {
  return useMemLCLogStore();
}
