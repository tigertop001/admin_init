import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAcctStStore = defineStore({
  id: "acctSt",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 资金冻结
     * @returns 返回 API 响应结果
     */
    async fznAmt(params) {
      try {
        let response = await api.fznAmt(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 资金解冻
     * @returns 返回 API 响应结果
     */
    async unFznAmt(params) {
      try {
        let response = await api.unFznAmt(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 禁止登录
     * @returns 返回 API 响应结果
     */
    async lgDis(params) {
      try {
        let response = await api.lgDis(params);
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
export function useAcctSt() {
  return useAcctStStore();
}
