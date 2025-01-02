import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const crtDFS = () => ({
  name: null,
  bkname: null,
  start: 0,
  limit: 10
});

const crtCols = (): PlusColumn[] => [
  {
    label: "姓名",
    prop: "name",
    valueType: "input"
  },
  {
    label: "银行名称",
    prop: "bkname",
    valueType: "input"
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      name: searchState.value.name,
      bkname: searchState.value.bkname
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
