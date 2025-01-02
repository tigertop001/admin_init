import { computed, ref, watch } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";

const typeSubMapping = {
  0: [
    { label: "全部", value: 0 },
    { label: "在线充值", value: 1 },
    { label: "余额提现", value: 2 },
    { label: "投注扣减", value: 3 }
  ],
  1: [
    { label: "全部", value: 0 },
    { label: "在线充值", value: 1 },
    { label: "人工充值", value: 2 },
    { label: "活动充值", value: 3 }
  ],
  2: [
    { label: "全部", value: 0 },
    { label: "余额提现", value: 1 },
    { label: "人工提现", value: 2 }
  ],
  3: [
    { label: "全部", value: 0 },
    { label: "签到活动", value: 1 },
    { label: "充值活动", value: 2 },
    { label: "抽奖活动", value: 3 }
  ],
  4: [
    { label: "全部", value: 0 },
    { label: "代理佣金", value: 1 },
    { label: "返水佣金", value: 2 }
  ]
};

export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  createdAtStart: number | null;
  createdAtEnd: number | null;
  type: string | number | null;
  sub: string | number | null;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  createdAtStart: null,
  createdAtEnd: null,
  type: null,
  sub: null,
  start: 0,
  limit: 10
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "createdAtStart",
  endKey: "createdAtEnd"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

const crtCols = (searchState: { value: SearchStateType }): PlusColumn[] => {
  const currentSubOptions = computed(() => {
    const type = searchState.value.type ?? 0;
    return (
      typeSubMapping[type as keyof typeof typeSubMapping] || typeSubMapping[0]
    );
  });

  watch(
    () => searchState.value.type,
    () => {
      searchState.value.sub = 0;
    }
  );

  return [
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
      label: "交易类型",
      labelWidth: 120,
      prop: "type",
      valueType: "select",
      options: [
        { label: "全部", value: 0 },
        { label: "充值", value: 1 },
        { label: "提现", value: 2 },
        { label: "活动", value: 3 },
        { label: "佣金", value: 4 }
      ]
    },
    {
      label: "子项",
      labelWidth: 120,
      prop: "sub",
      valueType: "select",
      options: currentSubOptions
    },
    {
      label: "交易时间",
      prop: "regTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetimerange",
        startPlaceholder: "请选择",
        endPlaceholder: "请选择",
        onChange: (val: any) =>
          onDateChg(searchState.value, val, "createdAtStart", "createdAtEnd")
      }
    }
  ];
};

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      createdAtStart: searchState.value.createdAtStart,
      createdAtEnd: searchState.value.createdAtEnd,
      type: searchState.value.type,
      sub: searchState.value.sub
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] = accountField.content;
    }

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

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp
  };
};
