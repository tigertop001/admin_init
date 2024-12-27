import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = () => ({
  name: null,
  status: null,
  start: 0,
  limit: 10
});

/**
 * 表单字段配置
 */
const crtCols = (): PlusColumn[] => [
  {
    label: "活动标题",
    prop: "name",
    labelWidth: 100,
    valueType: "input"
  },
  {
    label: "状态",
    labelWidth: 100,
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "已过期",
        value: 4
      },
      {
        label: "手动结束",
        value: 5
      }
    ]
  }
];

/**
 * 搜索参数处理 hook
 */
export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      status: searchState.value.status,
      name: searchState.value.name
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

  const onPrmUp = newParam => {
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
