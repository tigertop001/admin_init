import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

/**
 * 类型定义
 */
export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  timeStart: number | null;
  timeEnd: number | null;
  withdrawalState: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  timeStart: null,
  timeEnd: null,
  start: 0,
  limit: 10,
  withdrawalState: null
});

/**
 * 创建表单列配置
 */
const crtCols = (): PlusColumn[] => [
  {
    label: "标题",
    prop: "keyword",
    valueType: "input"
  },
  {
    label: "状态",
    prop: "withdrawalState",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "启用",
        value: 1
      },
      {
        label: "停用",
        value: 2
      }
    ]
  }
];

/**
 * 搜索参数处理 hook
 */
export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      timeStart: searchState.value.timeStart,
      timeEnd: searchState.value.timeEnd,
      withdrawalState: searchState.value.withdrawalState
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] = accountField.content;
    }
    return result;
  });
  const searchVal = computed(() => param.value);
  const columns = crtCols();

  const onSearch = () => {
    emit("update:param", param.value);
  };

  const onReset = () => {
    searchState.value = crtDFS();
  };

  const onPrmUp = (newParam: Partial<SearchStateType>) => {
    searchState.value = { ...searchState.value, ...newParam };
    emit("update:param", param.value);
  };

  const onAdd = () => emit("add");

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd
  };
};
