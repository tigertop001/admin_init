import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";
import { usPullCols } from "@/views/comm/details/comm/form/columns";
const { getPullData, configData, loading } = usPullCols();

/**
 * 类型定义
 */
export interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}
// 或者创建一个新的类型来处理扩展字段
export interface ExtendedSearchField extends SearchField {
  stype: string;
  scontent: string | number | null;
  [key: string]: any; // 允许其他可能的字段
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

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  levelName: null,
  levelSign: null,
  start: 0,
  limit: 10
});

const levelOptions = computed(() => {
  if (!configData.value?.data?.levelList) {
    return [];
  }
  return configData.value.data.levelList.map(item => ({
    label: item.levelName,
    value: item.id
  }));
});
const ensDtLd = async () => {
  if (!configData.value && !loading.value) {
    await getPullData();
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
    options: levelOptions.value
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

/**
 * 搜索参数处理 hook
 */
export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      levelName: searchState.value.levelName,
      levelSign: searchState.value.levelSign
    };

    // 组件会处理好输出格式，直接展开到结果中
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
