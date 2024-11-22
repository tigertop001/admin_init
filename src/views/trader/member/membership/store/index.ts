import { defineStore } from "pinia";
import { getMembershipListApi } from "../api";
import type { OnlineParams } from "../types";

// 定义 store
export const useMembershipStore = defineStore({
  id: "membership",
  state: () => ({}),
  actions: {
    async fetchMembershipList(params: OnlineParams = {}) {
      try {
        const response = await getMembershipListApi(params);
        return response;
      } catch (error) {
        console.error("Failed to fetch membership list:", error);
      }
    }
  }
});

// hooks 函数
export function useMembership() {
  return useMembershipStore();
}
