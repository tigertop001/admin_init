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

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  parentAccount: SearchField;
  createdAtStart: number | null;
  createdAtEnd: number | null;
  updatedAtStart: number | null;
  updatedAtEnd: number | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  parentAccount: { content: null, type: "parentAgentId", label: "UID" },
  createdAtStart: null,
  createdAtEnd: null,
  updatedAtStart: null,
  updatedAtEnd: null,
  start: 0,
  limit: 10
});

/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "createdAtStart" | "updatedAtStart",
  endKey: "createdAtEnd" | "updatedAtEnd"
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
    label: "代理",
    prop: "account",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.account}
        options={[
          { label: "UID", value: "uid", typename: "代理" },
          { label: "账号", value: "account", typename: "代理" }
        ]}
        onUpdate:modelValue={(newValue: SearchField) => {
          searchState.value.account = newValue;
        }}
      />
    )
  },
  {
    label: "上级代理",
    prop: "parentAccount",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.parentAccount}
        options={[
          { label: "UID", value: "parentAgentId", typename: "上级代理" },
          { label: "账号", value: "parentAgentAccount", typename: "上级代理" }
        ]}
        onUpdate:modelValue={(newValue: SearchField) => {
          searchState.value.parentAccount = newValue;
        }}
      />
    )
  },
  {
    label: "注册时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "createdAtStart", "createdAtEnd")
    }
  },
  {
    label: "登陆时间",
    prop: "loginTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "updatedAtStart", "updatedAtEnd")
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
      createdAtStart: searchState.value.createdAtStart,
      createdAtEnd: searchState.value.createdAtEnd,
      updatedAtStart: searchState.value.updatedAtStart,
      updatedAtEnd: searchState.value.updatedAtEnd
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] = accountField.content;
    }
    const parentField = searchState.value.parentAccount;
    if (parentField.content) {
      result[parentField.type] = parentField.content;
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
