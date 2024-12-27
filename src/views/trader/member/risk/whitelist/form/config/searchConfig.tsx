import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchStateType {
  start: number;
  limit: number;
  regStartTime: number | null;
  regEndTime: number | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  regStartTime: null,
  regEndTime: null,
  start: 0,
  limit: 10
});
const searchState = ref<SearchStateType>(crtDFS());
/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "regStartTime",
  endKey: "regEndTime"
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
const crtCols = (): PlusColumn[] => [
  {
    label: "所属代理",
    prop: "agent",
    valueType: "input"
  },
  {
    label: "会员帐号",
    prop: "acount",
    valueType: "input"
  },
  {
    label: "添加时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "regStartTime", "regEndTime")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      regStartTime: searchState.value.regStartTime,
      regEndTime: searchState.value.regEndTime
    };

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

  const onAdd = () => emit("add");

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
    onAdd,
    onPrmUp
  };
};
