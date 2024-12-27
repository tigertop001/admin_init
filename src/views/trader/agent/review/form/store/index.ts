import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAgtRevStore = defineStore({
  id: "agtRev",

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
     * @param params - 查询参数
     * @returns 返回 API 响应结果
     */
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 编辑
     */
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 统计
     */
    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取信息失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     *  通过/取消/批量操作/批量取消
     */
    async opt(params) {
      try {
        const response = await api.opt(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});
/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useAgtRev() {
  return useAgtRevStore();
}
