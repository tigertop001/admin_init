import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useLblTagStore = defineStore({
  id: "lblTag",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 获取活动标签列表数据
     */
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取活动标签列表数据失败:", error);
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
     * 编辑活动标签
     */
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑活动标签失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 删除活动标签
     */
    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("删除活动标签失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useLblTag() {
  return useLblTagStore();
}
