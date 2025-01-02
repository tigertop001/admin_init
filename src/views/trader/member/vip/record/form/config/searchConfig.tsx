import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";

export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  createdAtBeginTime: number | null;
  createdAtEndTime: number | null;
  claimAtBeginTime: number | null;
  claimAtEndTime: number | null;
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

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  createdAtBeginTime: null,
  createdAtEndTime: null,
  claimAtBeginTime: null,
  claimAtEndTime: null,
  status: null,
  prizeType: null,
  start: 0,
  limit: 10
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "createdAtBeginTime" | "claimAtBeginTime",
  endKey: "createdAtEndTime" | "claimAtEndTime"
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
    label: "会员",
    prop: "account",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.account}
        options={[
          { label: "UID", value: "uid", typename: "会员" },
          { label: "账号", value: "account", typename: "会员" }
        ]}
        onUpdate:modelValue={(newValue: SearchField) => {
          searchState.value.account = newValue;
        }}
      />
    )
  },
  {
    label: "奖金类型",
    labelWidth: 150,
    prop: "rewardType",
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
    prop: "isClaim",
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
        onDateChg(
          searchState.value,
          val,
          "createdAtBeginTime",
          "createdAtEndTime"
        )
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
        onDateChg(searchState.value, val, "claimAtBeginTime", "claimAtEndTime")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      createdAtBeginTime: searchState.value.createdAtBeginTime,
      createdAtEndTime: searchState.value.createdAtEndTime,
      claimAtBeginTime: searchState.value.claimAtBeginTime,
      claimAtEndTime: searchState.value.claimAtEndTime,
      status: searchState.value.status,
      prizeType: searchState.value.prizeType
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] = accountField.content;
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
