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
  startAt: number | null;
  endAt: number | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  startAt: null,
  endAt: null,
  start: 0,
  limit: 10
});

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
        options={[
          { label: "UID", value: "uid", typename: "会员" },
          { label: "账号", value: "account", typename: "会员" }
        ]}
        onUpdate:modelValue={(newValue: SearchField) => {
          searchState.value.account = newValue;
        }}
      />
    )
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
