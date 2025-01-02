import { defineStore } from "pinia";
import { api } from "../api";

const useFdPtStore = defineStore({
  id: "fdPt",
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
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    },
    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("删除失败:", error);
        throw error;
      }
    },
    async ed(params) {
      try {
        const response = await api.ed(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    },
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});
export function useFdPt() {
  return useFdPtStore();
}
