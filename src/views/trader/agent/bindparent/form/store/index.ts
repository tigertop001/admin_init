import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAgBindStore = defineStore({
  id: "agBind",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    async bind(params) {
      try {
        const response = await api.bind(params);
        return response;
      } catch (error) {
        console.error("失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async ck(params) {
      try {
        const response = await api.ck(params);
        return response;
      } catch (error) {
        console.error("失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useAgBind() {
  return useAgBindStore();
}
