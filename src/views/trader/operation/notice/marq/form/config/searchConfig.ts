import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import { usPullCols } from "@/views/trader/comm/pull/notice/form/columns";
const { getPullData, cfgDt, loading } = usPullCols();

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const crtDFS = () => ({
  query: {
    keyword: "",
    type: null
  },
  start: 0,
  limit: 10
});

const lvlOp = computed(() => {
  if (!cfgDt.value?.data?.list.PublishStatus) {
    return [];
  }
  return cfgDt.value.data.list.PublishStatus.map(item => ({
    label: item.text,
    value: item.value
  }));
});
const ensDtLd = async () => {
  if (!cfgDt.value && !loading.value) {
    await getPullData({ query: ["EnableStatus"] });
  }
};

const crtCols = (): PlusColumn[] => [
  {
    label: "标题",
    prop: "query.keyword",
    valueType: "input"
  },
  {
    label: "状态",
    labelWidth: 100,
    prop: "query.type",
    valueType: "select",
    options: lvlOp.value
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      query: searchState.value.query
    };

    return result;
  });
  const searchVal = computed(() => param.value);
  const columns = crtCols();

  // 在初始化时加载数据
  ensDtLd();

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
