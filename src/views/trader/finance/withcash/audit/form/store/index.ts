import { defineStore } from "pinia";
import { api } from "../api";

const useFwAuditStore = defineStore({
  id: "fwAudit",

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

    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取信息失败:", error);
        throw error;
      }
    }
  }
});

export function useFwAudit() {
  return useFwAuditStore();
}
