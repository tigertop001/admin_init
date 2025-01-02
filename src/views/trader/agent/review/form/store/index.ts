import { defineStore } from "pinia";
import { api } from "../api";

const useAgtRevStore = defineStore({
  id: "agtRev",

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

    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error;
      }
    },

    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取信息失败:", error);
        throw error;
      }
    },
    /**
     *  通过/取消/批量操作/批量取消
     */
    async opt(params) {
      try {
        const response = await api.opt(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    }
  }
});

export function useAgtRev() {
  return useAgtRevStore();
}
