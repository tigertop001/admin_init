import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";

export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

export interface ExtendedSearchField extends SearchField {
  stype: string;
  scontent: string | number | null;
  [key: string]: any;
}

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  parentAccount: SearchField;
  inviterAccount: SearchField;
  regTimeStart: number | null;
  regTimeEnd: number | null;
  loginTimeStart: number | null;
  loginTimeEnd: number | null;
}

export type UserType = "account" | "parentAccount" | "inviterAccount";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const searchOptions = {
  account: [
    { label: "UID", value: "uid", typename: "会员" },
    { label: "账号", value: "account", typename: "会员" }
  ],
  parentAccount: [
    { label: "UID", value: "uid", typename: "上级代理" },
    { label: "账号", value: "account", typename: "上级代理" }
  ],
  inviterAccount: [
    { label: "UID", value: "uid", typename: "邀请人" },
    { label: "账号", value: "account", typename: "邀请人" }
  ]
} as const;

const fieldMappings = {
  account: {
    label: "会员",
    typeKey: "sAccountType",
    contentKey: "sAccountContent",
    options: searchOptions.account
  },
  parentAccount: {
    label: "上级代理",
    typeKey: "sParentAccountType",
    contentKey: "sParentAccountContent",
    options: searchOptions.parentAccount
  },
  inviterAccount: {
    label: "邀请人",
    typeKey: "sInviterAccountType",
    contentKey: "sInviterAccountContent",
    options: searchOptions.inviterAccount
  }
} as const;

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  parentAccount: { content: null, type: "uid", label: "UID" },
  inviterAccount: { content: null, type: "uid", label: "UID" },
  regTimeStart: null,
  regTimeEnd: null,
  loginTimeStart: null,
  loginTimeEnd: null,
  start: 0,
  limit: 10
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "regTimeStart" | "loginTimeStart",
  endKey: "regTimeEnd" | "loginTimeEnd"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

const createSearchField = (
  searchState: { value: SearchStateType },
  fieldKey: keyof typeof fieldMappings
): PlusColumn => ({
  label: fieldMappings[fieldKey].label,
  prop: fieldKey,
  renderField: () => (
    <AccountTypeField
      modelValue={searchState.value[fieldKey]}
      options={fieldMappings[fieldKey].options}
      config={{
        typeKey: fieldMappings[fieldKey].typeKey,
        contentKey: fieldMappings[fieldKey].contentKey,
        isStype: true
      }}
      onUpdate:modelValue={(newValue: SearchField) => {
        if (newValue.type !== searchState.value[fieldKey].type) {
          searchState.value[fieldKey] = {
            ...newValue,
            content: null
          };
        } else {
          searchState.value[fieldKey] = newValue;
        }
      }}
    />
  )
});

const crtCols = (searchState: { value: SearchStateType }): PlusColumn[] => [
  createSearchField(searchState, "account"),
  createSearchField(searchState, "parentAccount"),
  createSearchField(searchState, "inviterAccount"),
  {
    label: "注册时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "regTimeStart", "regTimeEnd")
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
        onDateChg(searchState.value, val, "loginTimeStart", "loginTimeEnd")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      regTimeStart: searchState.value.regTimeStart,
      regTimeEnd: searchState.value.regTimeEnd,
      loginTimeStart: searchState.value.loginTimeStart,
      loginTimeEnd: searchState.value.loginTimeEnd
    };

    Object.entries(fieldMappings).forEach(([field, keys]) => {
      const fieldValue = searchState.value[field] as ExtendedSearchField;
      const typeKey = keys.typeKey;
      const contentKey = keys.contentKey;

      if (fieldValue && fieldValue[typeKey] && fieldValue[contentKey]) {
        result[typeKey] = fieldValue[typeKey];
        result[contentKey] = fieldValue[contentKey];
      }
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
