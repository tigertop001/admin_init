import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchStateType {
  start: number;
  limit: number;
  account: string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: null,
  start: 0,
  limit: 10
});

const crtCols = (): PlusColumn[] => [
  {
    label: "会员帐号",
    prop: "account",
    valueType: "input"
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      account: searchState.value.account
    };

    return result;
  });

  const searchVal = computed(() => param.value);
  const columns = crtCols();
  // 在初始化时加载数据
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

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp
  };
};
