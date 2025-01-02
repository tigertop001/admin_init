import { defineStore } from "pinia";
import { api } from "../api";

const useMemLGRecStore = defineStore({
  id: "memLGRec",

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
    /**
     * 退出三方账户
     */
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

export function useMemLGRec() {
  return useMemLGRecStore();
}
