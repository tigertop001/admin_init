import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const crtDFS = () => ({
  tagId: null,
  status: null,
  start: 0,
  limit: 10
});

const crtCols = (): PlusColumn[] => [
  {
    label: "活动标签",
    prop: "tagId",
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
        label: "开启",
        value: 1
      },
      {
        label: "关闭",
        value: 2
      }
    ]
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      tagId: searchState.value.tagId,
      status: searchState.value.status
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

  const onAdd = () => {
    emit("add");
  };
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
