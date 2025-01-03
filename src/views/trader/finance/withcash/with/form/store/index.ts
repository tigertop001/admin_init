import { defineStore } from "pinia";
import { api } from "../api";

const useFwWithStore = defineStore({
  id: "fwWith",

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
    async cxl(params) {
      try {
        const response = await api.cxl(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
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
    async clear(params) {
      try {
        const response = await api.clear(params);
        return response;
      } catch (error) {
        console.error("清除失败:", error);
        throw error;
      }
    },
    async betcxl(params) {
      try {
        const response = await api.betcxl(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    },
    async betver(params) {
      try {
        const response = await api.betver(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    },
    async betpay(params) {
      try {
        const response = await api.betpay(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});

export function useFwWith() {
  return useFwWithStore();
}
