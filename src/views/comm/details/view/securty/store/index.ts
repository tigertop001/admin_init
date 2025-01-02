import { defineStore } from "pinia";
import { api } from "../api";

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
        throw error;
      }
    },
    async reLog(params) {
      try {
        let response = await api.reLog(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    },
    async rePay(params) {
      try {
        let response = await api.rePay(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    },
    async chgInfo(params) {
      try {
        let response = await api.chgInfo(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    }
  }
});

export function useSecurty() {
  return useSecurtyStore();
}
