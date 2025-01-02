import { defineStore } from "pinia";
import { api } from "../api";
import type { PullType } from "../api/config";

export const useAgpulStore = defineStore({
  id: "agpul",

  state: () => ({
    pullData: {} as Record<PullType, Result | null>
  }),

  actions: {
    setData(type: PullType, data: Result) {
      this.pullData[type] = data;
    },

    async pull(type: PullType, params: Record<string, any>) {
      if (this.pullData[type]) {
        return this.pullData[type];
      }

      try {
        const response = await api.pull(type, params);
        if (response?.code === 0) {
          this.setData(type, response);
        }
        return response;
      } catch (error) {
        console.error(`获取${type}数据失败:`, error);
        throw error;
      }
    }
  },

  getters: {
    getPullData: state => (type: PullType) => state.pullData[type]
  }
});

export function useAgpul() {
  return useAgpulStore();
}
