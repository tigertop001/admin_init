import { defineStore } from "pinia";
import { api } from "../api";

const useFwFeeStore = defineStore({
  id: "fwFee",

  state: () => ({}),

  actions: {
    async set(params) {
      try {
        const response = await api.set(params);
        return response;
      } catch (error) {
        console.error("设置失败:", error);
        throw error;
      }
    },
    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取信息失败", error);
        throw error;
      }
    }
  }
});

export function useFwFee() {
  return useFwFeeStore();
}
