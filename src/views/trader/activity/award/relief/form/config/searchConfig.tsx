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
  startAt: number | null;
  endAt: number | null;
  status: number | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const crtDFS = (defaultType: number = 4) => ({
  account: { content: null, type: "uid", label: "UID" },
  startAt: null,
  endAt: null,
  status: null,
  start: 0,
  limit: 10,
  type: defaultType
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
    label: "充值时间",
    prop: "time",
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
    label: "状态",
    labelWidth: 100,
    prop: "status",
    valueType: "select",
    options: [
      { label: "全部", value: 0 },
      { label: "审核中", value: 3 },
      { label: "已发放", value: 2 },
      { label: "已取消", value: 4 }
    ]
  }
];

export const useSearch = (
  emit: (event: string, ...args: any[]) => void,
  defaultType: number = 4
) => {
  const searchState = ref(crtDFS(defaultType));

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      startAt: searchState.value.startAt,
      endAt: searchState.value.endAt
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
    searchState.value = crtDFS(defaultType);
  };

  const onAdd = () => emit("add");

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
    onAdd,
    onPrmUp
  };
};
