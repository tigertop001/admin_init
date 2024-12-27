import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 状态管理
 */
const useActiveListStore = defineStore({
  id: "activeList",
  /**
   * Actions 定义
   */
  actions: {
    /**
     * 列表
     */
    async list(params) {
      try {
        const response = await api.list(params);
        return response;
      } catch (error) {
        console.error("列表失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 新增
     */
    async add(params) {
      try {
        const response = await api.add(params);
        return response;
      } catch (error) {
        console.error("新增失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 编辑
     */
    async edit(params) {
      try {
        const response = await api.edit(params);
        return response;
      } catch (error) {
        console.error("编辑失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 删除
     */
    async del(params) {
      try {
        const response = await api.del(params);
        return response;
      } catch (error) {
        console.error("删除失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 发布
     */
    async pub(params) {
      try {
        const response = await api.pub(params);
        return response;
      } catch (error) {
        console.error("发布失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 详情
     */
    async info(params) {
      try {
        const response = await api.info(params);
        return response;
      } catch (error) {
        console.error("获取信息失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 结束
     */
    async end(params) {
      try {
        const response = await api.end(params);
        return response;
      } catch (error) {
        console.error("操作失败:", error);
        throw error; // 向上抛出错误，让调用者处理
      }
    },
    /**
     * 文件上传
     */
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

/**
 * @returns 返回相关的状态和方法
 */
export function useActiveList() {
  return useActiveListStore();
}
