import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useMemLGSetStore = defineStore({
  id: "memLGSet",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 获取列表数据
     */
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 更新备注
     */
    async up(params) {
      try {
        const response = await api.up(params);
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
export function useMemLGSet() {
  return useMemLGSetStore();
}
