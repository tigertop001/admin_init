import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
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
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useInfoLevel() {
  return useInfoLevelStore();
}
