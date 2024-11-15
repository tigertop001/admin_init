// store/home.ts
import { defineStore } from "pinia";
import {
  getHomeDataApi,
  getOnlineSummaryApi,
  getOnlineApi,
  getRankingListApi
} from "../api";
import type { OnlineParams } from "../types";

export const homeUserStore = defineStore({
  id: "homeUser",
  state: () => ({
    homeData: {},
    onlineSummaryData: {},
    onlineData: {
      day0: [],
      day1: []
    },
    rankingListData: {
      rechargeRank: [],
      withdrawRank: [],
      profitRank: [],
      proxyRank: []
    }
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
    async getOnlineSummary(params: OnlineParams = {}) {
      try {
        const response = await getOnlineSummaryApi(params);
        this.onlineSummaryData = response.data; // 将数据保存到 state 中
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getOnline(params: OnlineParams = {}) {
      try {
        const response = await getOnlineApi(params);
        this.onlineData = response.data; // 将数据保存到 state 中
        console.log("this.onlineData", this.onlineData.day0);
        console.log("this.onlineData", this.onlineData.day1);
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    async getRankingList(params: OnlineParams = {}) {
      try {
        const response = await getRankingListApi(params);
        this.rankingListData = response.data; // 将数据保存到 state 中
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    }
  }
});

export function useUserStoreHook() {
  return homeUserStore();
}
