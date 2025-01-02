import { defineStore } from "pinia";
import { api } from "../api";

const useLblTagStore = defineStore({
  id: "lblTag",
  state: () => ({}),
  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("获取活动标签列表数据失败:", error);
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
        console.error("编辑活动标签失败:", error);
        throw error;
      }
    },
    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("删除活动标签失败:", error);
        throw error;
      }
    }
  }
});

export function useLblTag() {
  return useLblTagStore();
}
