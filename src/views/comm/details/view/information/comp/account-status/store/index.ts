import { defineStore } from "pinia";
import { api } from "../api";

const useAcctStStore = defineStore({
  id: "acctSt",

  state: () => ({}),

  actions: {
    async fznAmt(params) {
      try {
        let response = await api.fznAmt(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    },
    async unFznAmt(params) {
      try {
        let response = await api.unFznAmt(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    },
    async lgDis(params) {
      try {
        let response = await api.lgDis(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    }
  }
});

export function useAcctSt() {
  return useAcctStStore();
}
