import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  startAt: number | null;
  endAt: number | null;
  operator: string | null;
  isOnline?: boolean;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  startAt: null,
  endAt: null,
  operator: null,
  start: 0,
  limit: 10
});

const crtCols = (): PlusColumn[] => [
  {
    label: "支付通道ID",
    labelWidth: 110,
    prop: "paychannname",
    valueType: "input"
  },
  {
    label: "支付通道名称",
    labelWidth: 110,
    prop: "orderNo",
    valueType: "input"
  },
  {
    label: "支付类型",
    labelWidth: 120,
    prop: "operator",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "支付宝",
        value: 1
      },
      {
        label: "财付通",
        value: 2
      },
      {
        label: "微信",
        value: 3
      },
      {
        label: "云闪付",
        value: 4
      },
      {
        label: "银行卡",
        value: 5
      }
    ]
  },
  {
    label: "状态",
    labelWidth: 120,
    prop: "operator",
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
        label: "禁用",
        value: 2
      },
      {
        label: "已删除",
        value: 3
      }
    ]
  },
  {
    label: "是否匹配交易",
    labelWidth: 120,
    prop: "operator",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "是",
        value: 1
      },
      {
        label: "否",
        value: 2
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
      startAt: searchState.value.startAt,
      endAt: searchState.value.endAt,
      operator: searchState.value.operator
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

  const onAdd = () => {
    emit("add");
  };
  const onMarSet = () => {
    console.log("ccc-");
    emit("marset");
  };
  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd,
    onMarSet
  };
};
