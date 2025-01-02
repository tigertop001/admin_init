import { defineStore } from "pinia";
import { api } from "../api";

const useActiveListStore = defineStore({
  id: "activeList",

  actions: {
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("列表失败:", error);
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
    async pub(params) {
      try {
        const response = await api.pub(params);
        return response;
      } catch (error) {
        console.error("发布失败:", error);
        throw error;
      }
    },
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("获取信息失败:", error);
        throw error;
      }
    },
    async end(params) {
      try {
        const response = await api.end(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error;
      }
    },
    async upload(file: File) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.upload(formData);
        return response;
      } catch (error) {
        console.error("文件上传失败:", error);
        throw error;
      }
    }
  }
});

export function useActiveList() {
  return useActiveListStore();
}
