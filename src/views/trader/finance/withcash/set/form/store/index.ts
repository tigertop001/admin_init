import { defineStore } from "pinia";
import { api } from "../api";

const useFwSetStore = defineStore({
  id: "fwSet",

  state: () => ({}),

  actions: {
    async add(params) {
      try {
        const response = await api.add(params);
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

export function useFwSet() {
  return useFwSetStore();
}
