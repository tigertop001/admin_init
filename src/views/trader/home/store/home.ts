// store/home.ts
import { defineStore } from "pinia";
import { getHomeDataApi, getOnlineSummaryApi, getOnlineApi } from "../api";

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
        console.log("this.homeData--", this.homeData);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getOnlineSummary() {
      try {
        const response = await getOnlineSummaryApi();
        this.onlineSummaryData = response.data; // 将数据保存到 state 中
        console.log("this.onlineSummaryData--", this.onlineSummaryData);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getOnline() {
      try {
        const response = await getOnlineApi();
        this.onlineData = response.data; // 将数据保存到 state 中
        console.log("this.onlineSummaryData--", this.onlineData);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    }
  }
});

export function useUserStoreHook() {
  return homeUserStore();
}
