import { computed, ref } from "vue";

/**
 * 类型定义
 */
export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}
// 或者创建一个新的类型来处理扩展字段
export interface ExtendedSearchField extends SearchField {
  stype: string;
  scontent: string | number | null;
  [key: string]: any; // 允许其他可能的字段
}

export interface SearchStateType {
  start: number;
  limit: number;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  start: 0,
  limit: 10
});

/**
 * 搜索参数处理 hook
 */
export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit
    };

    return result;
  });

  const searchVal = computed(() => param.value);

  const onSearch = () => {
    emit("update:param", param.value);
  };

  return {
    searchState,
    searchVal,
    onSearch
  };
};
