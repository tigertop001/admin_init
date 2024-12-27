import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useSecurtyStore = defineStore({
  id: "securty",
  state: () => ({}),
  actions: {
    async check(params) {
      try {
        let response = await api.check(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async reLog(params) {
      try {
        let response = await api.reLog(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async rePay(params) {
      try {
        let response = await api.rePay(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    async chgInfo(params) {
      try {
        let response = await api.chgInfo(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useSecurty() {
  return useSecurtyStore();
}
