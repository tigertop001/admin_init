import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAgSetStore = defineStore({
  id: "agSet",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async add(params) {
      console.log("---ee---add---");
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async edit(params) {
      console.log("---ee---edit---");
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async delete(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useAgSet() {
  return useAgSetStore();
}
