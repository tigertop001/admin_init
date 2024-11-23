import { defineStore } from "pinia";
import { getMembershipListApi } from "../api";
import type { OnlineParams } from "../types";

/**
 * 会员管理相关状态管理
 */
const useMembershipStore = defineStore({
  id: "membership",

  /**
   * 状态定义
   */
  state: () => ({
    // 如果需要在这里添加全局状态
    // memberList: [],
    // total: 0,
    // loading: false
  }),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 获取会员列表数据
     * @param params - 查询参数
     * @returns 返回 API 响应结果
     */
    async fetchMembershipList(params: OnlineParams = {}) {
      try {
        const response = await getMembershipListApi(params);
        return response;
      } catch (error) {
        console.error("获取会员列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    }
  }
});

/**
 * 会员管理 Store 封装 Hook
 * @returns 返回会员管理相关的状态和方法
 */
export function useMembership() {
  return useMembershipStore();
}

// 导出 store 以供可能的类型使用
export type MembershipStore = ReturnType<typeof useMembershipStore>;
