import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useMemBanSetStore = defineStore({
  id: "memBanSet",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 配置
     */
    async set(params) {
      try {
        const response = await api.set(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 删除
     */
    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useMemBanSet() {
  return useMemBanSetStore();
}
