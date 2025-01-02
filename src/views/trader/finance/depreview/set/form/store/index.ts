import { defineStore } from "pinia";
import { api } from "../api";

const useFdSetStore = defineStore({
  id: "fdSet",

  state: () => ({}),

  actions: {
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
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

export function useFdSet() {
  return useFdSetStore();
}
