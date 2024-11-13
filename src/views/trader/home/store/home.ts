// store/home.ts
import { defineStore } from "pinia";
import { getHomeDataApi } from "../api";

export const homeUserStore = defineStore({
  id: "homeUser",
  state: () => ({
    homeData: {
      register: {},
      recharge: {},
      withdraw: {},
      active: {},
      bet: {}
    } // 存储请求返回的数据
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
    }
  }
});

export function useUserStoreHook() {
  return homeUserStore();
}
