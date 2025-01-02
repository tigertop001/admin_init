import { defineStore } from "pinia";
import { api } from "../api";

const useDetailInfoStore = defineStore({
  id: "detailInfo",

  state: () => ({}),

  actions: {
    async dtls(params) {
      try {
        let response = await api.dtls(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});

export function useDetailInfo() {
  return useDetailInfoStore();
}
