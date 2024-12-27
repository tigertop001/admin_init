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
  uid: number;
  account: SearchField;
  startTime: number | null;
  endTime: number | null;
}

export type UserType = "account";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 常量配置
 */
export const srchOpts = {
  account: [
    { label: "账号", value: "account", typename: "操作者" },
    { label: "昵称", value: "nickname", typename: "操作者" }
  ]
} as const;

export const fieldMapping = {
  account: { idKey: "account", nameKey: "nickname" }
} as const;

/**
 * 创建默认搜索状态
 */
export const crtDFS = (uid): SearchStateType => ({
  account: { content: null, type: "account", label: "UID" },
  startTime: null,
  endTime: null,
  uid: uid,
  start: 0,
  limit: 10
});

/**
 * 日期处理方法
 */
const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "startTime",
  endKey: "endTime"
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
    label: "日期",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "startTime", "endTime")
    }
  },
  {
    label: "会员行为",
    prop: "oparate",
    valueType: "select",
    options: [
      {
        label: "未解决",
        value: "0",
        color: "red"
      },
      {
        label: "已解决",
        value: "1",
        color: "blue"
      },
      {
        label: "解决中",
        value: "2",
        color: "yellow"
      },
      {
        label: "失败",
        value: "3",
        color: "red"
      }
    ]
  },
  {
    label: "操作者",
    prop: "account",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.account}
        options={srchOpts.account}
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
  }
];

/**
 * 搜索参数处理 hook
 */
export const useSearch = (
  emit: (event: string, ...args: any[]) => void,
  uid
) => {
  const searchState = ref<SearchStateType>(crtDFS(uid));

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      startTime: searchState.value.startTime,
      endTime: searchState.value.endTime,
      uid
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
    searchState.value = crtDFS(uid);
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
