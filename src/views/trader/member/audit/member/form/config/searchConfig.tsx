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
  account: { content: null, type: "uid", label: "UID" },
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
    label: "项目",
    prop: "items",
    valueType: "select",
    options: [
      { label: "头像", value: "avatar" },
      { label: "名称", value: "uname" },
      { label: "手机号", value: "phone" },
      { label: "昵称", value: "nickname" },
      { label: "背景图", value: "skinType" },
      { label: "个性签名", value: "profile" },
      { label: "清除", value: "clear" },
      { label: "全部", value: null }
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
    prop: "time",
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

    const accountField = searchState.value.account as ExtendedSearchField;
    if (accountField && accountField.stype && accountField.scontent) {
      result.stype = accountField.stype;
      result.scontent = accountField.scontent;
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
