import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAwdStore = defineStore({
  id: "actAwd",

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
     * 取消
     */
    async cxl(params) {
      try {
        const response = await api.cxl(params);
        return response;
      } catch (error) {
        console.error("取消失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 自定义取消/发放
     */
    async diyCxl(params) {
      try {
        const response = await api.diyCxl(params);
        return response;
      } catch (error) {
        console.error("取消失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useAwd() {
  return useAwdStore();
}
