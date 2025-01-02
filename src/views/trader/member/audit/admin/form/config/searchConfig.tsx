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
  startTime: number | null;
  endTime: number | null;
}

export type UserType = "account";

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const srchOpts = {
  account: [
    { label: "UID", value: "uid", typename: "会员" },
    { label: "用户名", value: "account", typename: "会员" },
    { label: "昵称", value: "nickname", typename: "会员" }
  ]
} as const;

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "ip", label: "IP" },
  startTime: null,
  endTime: null,
  start: 0,
  limit: 10
});

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

const crtCols = (searchState: { value: SearchStateType }): PlusColumn[] => [
  {
    label: "审核状态",
    prop: "status",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "待审核",
        value: 1
      },
      {
        label: "已驳回",
        value: 2
      },
      {
        label: "已通过",
        value: 3
      },
      {
        label: "已撤销",
        value: 4
      },
      {
        label: "黑名单",
        value: 5
      },
      {
        label: "已清除",
        value: 6
      }
    ]
  },
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
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      startTime: searchState.value.startTime,
      endTime: searchState.value.endTime
    };

    Object.entries(searchState.value).forEach(([key, field]) => {
      if (field && typeof field === "object" && "type" in field) {
        const searchField = field as ExtendedSearchField;
        if (searchField.stype && searchField.scontent) {
          const options = srchOpts[key];
          if (
            options &&
            options.some(option => option.value === searchField.stype)
          ) {
            result[`${key}_stype`] = searchField.stype;
            result[`${key}_scontent`] = searchField.scontent;
          }
        }
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
