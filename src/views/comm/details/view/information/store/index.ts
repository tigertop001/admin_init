import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useDetailInfoStore = defineStore({
  id: "detailInfo",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 获取数据
     * @param params - 查询参数
     * @returns 返回 API 响应结果
     */
    async dtls(params) {
      try {
        let response = await api.dtls(params);
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
export function useDetailInfo() {
  return useDetailInfoStore();
}
