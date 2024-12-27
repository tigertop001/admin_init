// store/index.ts
import { defineStore } from "pinia";
import { api } from "../api";

export const useMPStore = defineStore({
  id: "mp",

  state: () => ({
    configData: null as Result | null
  }),

  actions: {
    setConfigData(data: Result) {
      this.configData = data;
    },

    async pull(params) {
      // 如果已经有数据，直接返回
      if (this.configData) {
        return this.configData;
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
    getConfigData: state => state.configData
  }
});

export function useMP() {
  return useMPStore();
}
