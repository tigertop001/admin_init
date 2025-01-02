import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchStateType {
  start: number;
  limit: number;
  fields: string;
  name: string;
  status: number;
  operator: string;
  startAt: number | null;
  endAt: number | null;
  type: number;
}
export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  start: 0,
  limit: 10,
  fields: null,
  name: null,
  status: null,
  operator: null,
  startAt: null,
  endAt: null,
  type: null
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "startAt",
  endKey: "endAt"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

const crtCols = (searchState: { value: SearchStateType }): PlusColumn[] => [
  {
    label: "后台账号",
    prop: "name",
    labelWidth: 100,
    valueType: "input"
  },
  {
    label: "创建时间",
    prop: "loginTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "startAt", "endAt")
    }
  },
  {
    label: "最后登陆时间",
    prop: "loginTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "startAt", "endAt")
    }
  },
  {
    label: "账号状态",
    labelWidth: 100,
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "未发布",
        value: 1
      },
      {
        label: "未开始",
        value: 2
      },
      {
        label: "进行中",
        value: 4
      }
    ]
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());
  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      fields: searchState.value.fields,
      name: searchState.value.name,
      status: searchState.value.status,
      operator: searchState.value.operator,
      startAt: searchState.value.startAt,
      endAt: searchState.value.endAt,
      type: searchState.value.type
    };

    return result;
  });
  const searchVal = computed(() => param.value);
  const columns = crtCols(searchState);

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
