// store/index.ts
import { defineStore } from "pinia";
import { api } from "../api";

export const useMPStore = defineStore({
  id: "mp",

  state: () => ({
    cfgDt: null as Result | null
  }),

  actions: {
    setConfigData(data: Result) {
      this.cfgDt = data;
    },

    async pull(params) {
      if (this.cfgDt) {
        return this.cfgDt;
      }

      try {
        const response = await api.pull(params);
        if (response?.code === 0) {
          this.setConfigData(response);
        }
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  },

  getters: {
    getConfigData: state => state.cfgDt
  }
});

export function useMP() {
  return useMPStore();
}
