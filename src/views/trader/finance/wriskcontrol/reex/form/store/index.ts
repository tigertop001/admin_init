import { defineStore } from "pinia";
import { api } from "../api";

const useFinReexStore = defineStore({
  id: "finReex",
  state: () => ({}),
  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
        throw error;
      }
    },

    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error;
      }
    },
    async addNow(params) {
      try {
        const response = await api.addNow(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    },
    async add3rd(params) {
      try {
        const response = await api.add3rd(params);
        return response;
      } catch (error) {
        console.error("加入失败:", error);
        throw error;
      }
    },
    async qt3rd(params) {
      try {
        const response = await api.qt3rd(params);
        return response;
      } catch (error) {
        console.error("退出失败:", error);
        throw error;
      }
    },
    async getMny(params) {
      try {
        const response = await api.getMny(params);
        return response;
      } catch (error) {
        console.error("获取失败:", error);
        throw error;
      }
    },
    async ent3rd(params) {
      try {
        const response = await api.ent3rd(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});

export function useFinReex() {
  return useFinReexStore();
}
