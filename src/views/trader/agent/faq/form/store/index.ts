import { defineStore } from "pinia";
import { api } from "../api";

const useAgFaqStore = defineStore({
  id: "agFaq",
  state: () => ({}),
  actions: {
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
    }
  }
});

export function useAgFaq() {
  return useAgFaqStore();
}
