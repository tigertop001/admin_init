import { defineStore } from "pinia";
import { api } from "../api";

/**
 * 相关状态管理
 */
const useAgFaqStore = defineStore({
  id: "agFaq",

  /**
   * 状态定义
   */
  state: () => ({}),

  /**
   * Actions 定义
   */
  actions: {
    /**
     * 获取列表数据
     */
    async list(params) {
      try {
        let response = await api.list(params);
        response = {
          code: 0,
          msg: "success",
          data: {
            total: 2,
            list: [
              {
                id: 0,
                categoryId: 0,
                type: 1,
                lang: "lang",
                question: "question",
                answer: "answer",
                isDisplay: 1,
                createdAt: 2121211121,
                updatedAt: 212121
              },
              {
                id: 2,
                categoryId: 0,
                type: 2,
                lang: "langlang",
                question: "questionquestion",
                answer: "answeranswer",
                isDisplay: 2,
                createdAt: 433333,
                updatedAt: 3232323
              }
            ]
          }
        };
        return response;
      } catch (error) {
        console.error("获取列表数据失败:", error);
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
    }
  }
});

/**
 * Store 封装 Hook
 * @returns 返回相关的状态和方法
 */
export function useAgFaq() {
  return useAgFaqStore();
}
