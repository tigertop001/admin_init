import { defineStore } from "pinia";
import { api } from "../api";

const useAgBindStore = defineStore({
  id: "agBind",

  state: () => ({}),

  actions: {
    async bind(params) {
      try {
        const response = await api.bind(params);
        return response;
      } catch (error) {
        console.error("失败:", error);
        throw error;
      }
    },
    async ck(params) {
      try {
        const response = await api.ck(params);
        return response;
      } catch (error) {
        console.error("失败:", error);
        throw error;
      }
    }
  }
});

export function useAgBind() {
  return useAgBindStore();
}
