import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";

export interface SearchStateType {
  start: number;
  limit: number;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

/**
 * 创建默认搜索状态
 */
export const crtDFS = (): SearchStateType => ({
  start: 0,
  limit: 10
});

/**
 * 创建表单列配置
 */
const crtCols = (): PlusColumn[] => [
  {
    label: "所属代理",
    prop: "agent",
    valueType: "input"
  },
  {
    label: "会员帐号",
    prop: "acount",
    valueType: "input"
  },
  {
    label: "风险等级",
    labelWidth: 100,
    prop: "fx01",
    valueType: "select",
    options: [
      {
        label: "低风险",
        value: 1
      },
      {
        label: "中风险",
        value: 2
      },
      {
        label: "高风险",
        value: 3
      },
      {
        label: "小时(倍)",
        value: 4
      },
      {
        label: "天数(倍)",
        value: 5
      }
    ]
  },
  {
    label: "风险内容",
    labelWidth: 100,
    prop: "fx02",
    valueType: "select",
    options: [
      {
        label: "连续盈利天数（倍）",
        value: 1
      },
      {
        label: "连续盈利小时（倍）",
        value: 2
      },
      {
        label: "同设备连续登录账户",
        value: 3
      },
      {
        label: "同IP连续登录账户",
        value: 4
      },
      {
        label: "同IP连续注册账户",
        value: 5
      },
      {
        label: "单笔投注金额",
        value: 6
      },
      {
        label: "单笔中奖金额",
        value: 7
      },
      {
        label: "单笔盈利金额",
        value: 8
      },
      {
        label: "单笔盈利率（倍）",
        value: 9
      }
    ]
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit
    };

    return result;
  });

  const searchVal = computed(() => param.value);
  const columns = crtCols();

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
