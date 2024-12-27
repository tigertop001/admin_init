import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useWalSetStore = defineStore({
  id: "walSet",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },
    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取信息失败", error);
        throw error;
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useWalSet() {
  return useWalSetStore();
}
