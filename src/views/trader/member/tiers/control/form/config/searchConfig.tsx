import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";
import { usPullCols } from "@/views/trader/comm/pull/member/form/columns";
const { getPullData, cfgDt, loading } = usPullCols();

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
  levelSign: number | string | null;
  account: SearchField;
  levelName: number | null;
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
    { label: "UID", value: "uid", typename: "会员" },
    { label: "用户名", value: "account", typename: "会员" }
  ]
} as const;

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  levelName: null,
  levelSign: null,
  start: 0,
  limit: 10
});

const lvlOp = computed(() => {
  if (!cfgDt.value?.data?.levelList) {
    return [];
  }
  return cfgDt.value.data.levelList.map(item => ({
    label: item.levelName,
    value: item.id
  }));
});
const ensDtLd = async () => {
  if (!cfgDt.value && !loading.value) {
    await getPullData();
  }
};

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
    label: "层级名称",
    prop: "levelName",
    valueType: "select",
    options: lvlOp.value
  },
  {
    label: "内层/外层",
    prop: "levelSign",
    valueType: "select",
    options: [
      {
        label: "外层",
        value: 1
      },
      {
        label: "内层",
        value: 2
      },
      {
        label: "VIP层",
        value: 3
      }
    ]
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      levelName: searchState.value.levelName,
      levelSign: searchState.value.levelSign
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
  // 在初始化时加载数据
  ensDtLd();

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
    onPrmUp,
    loading
  };
};
