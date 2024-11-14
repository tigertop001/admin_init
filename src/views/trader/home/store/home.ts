// store/home.ts
import { defineStore } from "pinia";
import { getHomeDataApi, getOnlineSummaryApi, getOnlineApi } from "../api";
import type { OnlineParams } from "../types/home";

export const homeUserStore = defineStore({
  id: "homeUser",
  state: () => ({
    homeData: {},
    onlineSummaryData: {},
    onlineData: {}
  }),
  actions: {
    async getHomeData() {
      try {
        const response = await getHomeDataApi();
        this.homeData = response.data; // 将数据保存到 state 中
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getOnlineSummary() {
      try {
        const response = await getOnlineSummaryApi();
        this.onlineSummaryData = response.data; // 将数据保存到 state 中
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getOnline(params: OnlineParams = {}) {
      try {
        const response = await getOnlineApi(params);
        this.onlineData = response.data; // 将数据保存到 state 中
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    }
  }
});

export function useUserStoreHook() {
  return homeUserStore();
}
