import { defineStore } from "pinia";
import { api } from "../api";

const useMemMemStore = defineStore({
  id: "memMem",

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
    async black(params) {
      try {
        const response = await api.black(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },
    async pass(params) {
      try {
        const response = await api.pass(params);
        return response;
      } catch (error) {
        console.error("通过失败:", error);
        throw error;
      }
    },
    async cancel(params) {
      try {
        const response = await api.cancel(params);
        return response;
      } catch (error) {
        console.error("撤销审核失败:", error);
        throw error;
      }
    },
    async clear(params) {
      try {
        const response = await api.clear(params);
        return response;
      } catch (error) {
        console.error("清除失败:", error);
        throw error;
      }
    },
    async reject(params) {
      try {
        const response = await api.reject(params);
        return response;
      } catch (error) {
        console.error("驳回失败:", error);
        throw error;
      }
    }
  }
});

export function useMemMem() {
  return useMemMemStore();
}
