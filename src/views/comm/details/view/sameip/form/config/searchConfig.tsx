import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchStateType {
  start: number;
  limit: number;
  uid: number;
  tabItem: string;
  startTime: number | null;
  endTime: number | null;
}

export type UserType = "account";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (obj): SearchStateType => ({
  startTime: null,
  endTime: null,
  uid: obj.uid,
  tabItem: obj.tabItem,
  start: 0,
  limit: 10
});

/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "startTime",
  endKey: "endTime"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

/**
 * 创建表单列配置
 */
const crtCols = (searchState: { value: SearchStateType }): PlusColumn[] => [
  {
    label: "日期",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "startTime", "endTime")
    }
  }
];

/**
 * 搜索参数处理 hook
 */
export const useSearch = (
  emit: (event: string, ...args: any[]) => void,
  obj
) => {
  const searchState = ref<SearchStateType>(crtDFS(obj));

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      startTime: searchState.value.startTime,
      endTime: searchState.value.endTime,
      uid: obj.uid,
      tabItem: obj.tabItem
    };

    return result;
  });

  const searchVal = computed(() => param.value);
  const columns = crtCols(searchState);

  const onSearch = () => {
    emit("update:param", param.value);
  };

  const onReset = () => {
    searchState.value = crtDFS(obj);
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
