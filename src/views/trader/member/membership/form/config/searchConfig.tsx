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
  inviterAccount: SearchField;
  regStartTime: number | null;
  regEndTime: number | null;
  loginStartTime: number | null;
  loginEndTime: number | null;
}

export type UserType = "account" | "parentAccount" | "inviterAccount";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 常量配置
 */
export const searchOptions = {
  account: [
    { label: "UID", value: "uid", typename: "会员" },
    { label: "账号", value: "username", typename: "会员" }
  ],
  parentAccount: [
    { label: "UID", value: "sUid", typename: "上级代理" },
    { label: "账号", value: "supName", typename: "上级代理" }
  ],
  inviterAccount: [
    { label: "UID", value: "initUid", typename: "邀请人" },
    { label: "账号", value: "initName", typename: "邀请人" }
  ]
} as const;

export const fieldMapping = {
  account: { idKey: "accountId", nameKey: "account" },
  parentAccount: { idKey: "parentId", nameKey: "parentMember" },
  inviterAccount: { idKey: "inviterAccountId", nameKey: "inviterAccountMember" }
} as const;

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  parentAccount: { content: null, type: "sUid", label: "UID" },
  inviterAccount: { content: null, type: "initUid", label: "UID" },
  regStartTime: null,
  regEndTime: null,
  loginStartTime: null,
  loginEndTime: null,
  start: 0,
  limit: 10
});

/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "regStartTime" | "loginStartTime",
  endKey: "regEndTime" | "loginEndTime"
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
        options={searchOptions.account}
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
    label: "上级代理",
    prop: "parentAccount",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.parentAccount}
        options={searchOptions.parentAccount}
        onUpdate:modelValue={(newValue: SearchField) => {
          if (newValue.type !== searchState.value.parentAccount.type) {
            searchState.value.parentAccount = {
              ...newValue,
              content: null
            };
          } else {
            searchState.value.parentAccount = newValue;
          }
        }}
      />
    )
  },
  {
    label: "邀请人",
    prop: "inviterAccount",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.inviterAccount}
        options={searchOptions.inviterAccount}
        onUpdate:modelValue={(newValue: SearchField) => {
          if (newValue.type !== searchState.value.inviterAccount.type) {
            searchState.value.inviterAccount = {
              ...newValue,
              content: null
            };
          } else {
            searchState.value.inviterAccount = newValue;
          }
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
        onDateChg(searchState.value, val, "regStartTime", "regEndTime")
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
        onDateChg(searchState.value, val, "loginStartTime", "loginEndTime")
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
      regStartTime: searchState.value.regStartTime,
      regEndTime: searchState.value.regEndTime,
      loginStartTime: searchState.value.loginStartTime,
      loginEndTime: searchState.value.loginEndTime
    };

    Object.entries(fieldMapping).forEach(([key, { idKey, nameKey }]) => {
      const field = searchState.value[key as UserType];
      const paramKey = field.label === "UID" ? idKey : nameKey;
      result[paramKey] = field.content ? Number(field.content) : null;
    });

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
