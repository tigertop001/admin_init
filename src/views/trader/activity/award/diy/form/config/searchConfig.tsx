import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  "update:activeType": (type: number) => void;
}

export const crtDFS = (defaultType: number = 5) => ({
  name: null,
  status: null,
  type: defaultType,
  start: 0,
  limit: 10
});

const crtCols = (): PlusColumn[] => [
  {
    label: "活动标题",
    prop: "name",
    valueType: "input"
  },
  {
    label: "状态",
    labelWidth: 100,
    prop: "status",
    valueType: "select",
    options: [
      { label: "全部", value: 0 },
      { label: "待发放", value: 1 },
      { label: "已发放", value: 2 },
      { label: "发放中", value: 3 },
      { label: "已停用", value: 4 }
    ]
  }
];

export const useSearch = (
  emit: (event: string, ...args: any[]) => void,
  defaultType: number = 5
) => {
  const searchState = ref(crtDFS(defaultType));

  const param = computed(() => ({
    start: searchState.value.start,
    limit: searchState.value.limit,
    name: searchState.value.name,
    status: searchState.value.status,
    type: Number(searchState.value.type)
  }));

  const searchVal = computed(() => param.value);
  const columns = crtCols();

  const onSearch = () => {
    emit("update:param", param.value);
  };

  const onReset = () => {
    searchState.value = crtDFS(defaultType);
  };

  const onPrmUp = (newParam: any) => {
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
