import { defineStore } from "pinia";
import { api } from "../api";

const useAgSetStore = defineStore({
  id: "agSet",

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
    },
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },
    async delete(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    },
    async info() {
      try {
        const response = await api.info();
        return response;
      } catch (error) {
        console.error("获取列表失败:", error);
        throw error;
      }
    }
  }
});

export function useAgSet() {
  return useAgSetStore();
}
