import { defineStore } from "pinia";
import { api } from "../api";

const useMemRskWlStore = defineStore({
  id: "memRskWl",

  state: () => ({}),

  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },

    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});

export function useMemRskWl() {
  return useMemRskWlStore();
}
