import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useMemPlayStore = defineStore({
  id: "memPlay",

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
     * 新增现有
     */
    async addNow(params) {
      try {
        const response = await api.addNow(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 加入三方账户
     */
    async add3rd(params) {
      try {
        const response = await api.add3rd(params);
        return response;
      } catch (error) {
        console.error("加入失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 退出三方账户
     */
    async qt3rd(params) {
      try {
        const response = await api.qt3rd(params);
        return response;
      } catch (error) {
        console.error("退出失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 获取用户钱包信息
     */
    async getMny(params) {
      try {
        const response = await api.getMny(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 是否进三方
     */
    async ent3rd(params) {
      try {
        const response = await api.ent3rd(params);
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
export function useMemPlay() {
  return useMemPlayStore();
}
