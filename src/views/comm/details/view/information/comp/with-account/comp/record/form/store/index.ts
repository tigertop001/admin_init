import { defineStore } from "pinia";
import { api } from "../api";

const useInfoWithAcctStore = defineStore({
  id: "infoWithAcct",
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
    async pass(params) {
      try {
        const response = await api.pass(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});

export function useInfoWithAcct() {
  return useInfoWithAcctStore();
}
