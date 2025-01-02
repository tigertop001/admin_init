import { defineStore } from "pinia";
import { api } from "../api";

const useMembershipStore = defineStore({
  id: "membership",

  state: () => ({}),

  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },

    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});

export function useMembership() {
  return useMembershipStore();
}
