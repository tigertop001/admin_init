import { defineStore } from "pinia";
import { api } from "../api";

const useMemBlackStore = defineStore({
  id: "memBlack",

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
     * 检查可用设置黑名单列表
     */
    async cklist(params) {
      try {
        const response = await api.ckList(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error;
      }
    },

    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },
    /**
     * 解冻
     */
    async frzn(params) {
      try {
        const response = await api.frzn(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    }
  }
});

export function useMemBlack() {
  return useMemBlackStore();
}
