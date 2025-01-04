import { defineStore } from "pinia";
import { api } from "../api";

const useFdepSetStore = defineStore({
  id: "fdepSet",
  state: () => ({}),
  actions: {
    async set(params) {
      try {
        const response = await api.set(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    },
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});
export function useFdepSet() {
  return useFdepSetStore();
}
