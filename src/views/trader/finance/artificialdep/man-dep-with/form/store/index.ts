import { defineStore } from "pinia";
import { api } from "../api";

const useFinAdepMdwStore = defineStore({
  id: "finAdepMdw",

  state: () => ({}),

  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error;
      }
    },
    /**
     * 更新备注
     */
    async balan(params) {
      try {
        const response = await api.balan(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    }
  }
});

export function useFinAdepMdw() {
  return useFinAdepMdwStore();
}
