import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";

/**
 * 类型定义
 */
export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}
// 或者创建一个新的类型来处理扩展字段
export interface ExtendedSearchField extends SearchField {
  stype: string;
  scontent: string | number | null;
  [key: string]: any; // 允许其他可能的字段
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  sendTimeStart: number | null;
  sendTimeEnd: number | null;
  getTimeStart: number | null;
  getTimeEnd: number | null;
  status: number | string | null;
  prizeType: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 常量配置
 */
export const srchOpts = {
  account: [
    { label: "UID", value: "uid", typename: "会员" },
    { label: "用户名", value: "account", typename: "会员" }
  ]
} as const;

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  sendTimeStart: null,
  sendTimeEnd: null,
  getTimeStart: null,
  getTimeEnd: null,
  status: null,
  prizeType: null,
  start: 0,
  limit: 10
});

/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "sendTimeStart" | "getTimeStart",
  endKey: "sendTimeEnd" | "getTimeEnd"
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
    label: "会员",
    prop: "account",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.account}
        options={srchOpts.account}
        config={{
          typeKey: "stype",
          contentKey: "scontent",
          isStype: true
        }}
        onUpdate:modelValue={(newValue: SearchField) => {
          if (newValue.type !== searchState.value.account.type) {
            searchState.value.account = {
              ...newValue,
              content: null
            };
          } else {
            searchState.value.account = newValue;
          }
        }}
      />
    )
  },
  {
    label: "奖金类型",
    labelWidth: 150,
    prop: "prizeType",
    valueType: "select",
    options: [
      { label: "全部", value: 0 },
      { label: "晋级奖金", value: 1 },
      { label: "周奖金", value: 2 },
      { label: "月奖金", value: 3 }
    ]
  },
  {
    label: "奖金状态",
    labelWidth: 150,
    prop: "status",
    valueType: "select",
    options: [
      { label: "全部", value: 0 },
      { label: "待领取", value: 1 },
      { label: "已领取", value: 2 }
    ]
  },
  {
    label: "发放时间",
    prop: "sendTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "sendTimeStart", "sendTimeEnd")
    }
  },
  {
    label: "领取时间",
    prop: "getTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "getTimeStart", "getTimeEnd")
    }
  }
];

/**
 * 搜索参数处理 hook
 */
export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      sendTimeStart: searchState.value.sendTimeStart,
      sendTimeEnd: searchState.value.sendTimeEnd,
      getTimeStart: searchState.value.getTimeStart,
      getTimeEnd: searchState.value.getTimeEnd,
      status: searchState.value.status,
      prizeType: searchState.value.prizeType
    };

    // 组件会处理好输出格式，直接展开到结果中
    const accountField = searchState.value.account as ExtendedSearchField;
    if (accountField && accountField.stype && accountField.scontent) {
      result.stype = accountField.stype;
      result.scontent = accountField.scontent;
    }

    return result;
  });

  const searchVal = computed(() => param.value);
  const columns = crtCols(searchState);
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

  const onAdd = () => {
    emit("add");
  };

  const onAdd3rd = () => {
    emit("add3rd");
  };
  const onQt3rd = () => {
    emit("qt3rd");
  };

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd,
    onAdd3rd,
    onQt3rd
  };
};
