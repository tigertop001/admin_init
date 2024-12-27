import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useMemBlackStore = defineStore({
  id: "memBlack",

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
     * 检查可用设置黑名单列表
     */
    async cklist(params) {
      try {
        const response = await api.ckList(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 新增
     */
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error; // 向上抛出错误，让调用者处理
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
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useMemBlack() {
  return useMemBlackStore();
}
