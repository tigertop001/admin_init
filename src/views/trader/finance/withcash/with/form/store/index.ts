import { defineStore } from "pinia";
import { api } from "../api";

const useFwWithStore = defineStore({
  id: "fwWith",
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
    async cxl(params) {
      try {
        const response = await api.cxl(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});
export function useFwWith() {
  return useFwWithStore();
}
