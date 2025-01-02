import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";

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
  operator: string | null;
  game: string | null;
  gameplan: string | null;
  gametag: string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "id", label: "ID" },
  startAt: null,
  endAt: null,
  operator: null,
  start: 0,
  limit: 10,
  game: null,
  gameplan: null,
  gametag: null
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "startAt",
  endKey: "endAt"
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
    label: "平台",
    prop: "account",
    renderField: () => (
      <AccountTypeField
        modelValue={searchState.value.account}
        options={[
          { label: "ID", value: "id", typename: "平台" },
          { label: "账号", value: "account", typename: "平台" },
          { label: "名称", value: "name", typename: "平台" }
        ]}
        onUpdate:modelValue={(newValue: SearchField) => {
          searchState.value.account = newValue;
        }}
      />
    )
  },
  {
    label: "游戏",
    labelWidth: 120,
    prop: "game",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "彩票",
        value: 1
      },
      {
        label: "电子",
        value: 2
      },
      {
        label: "棋牌",
        value: 3
      },
      {
        label: "游戏",
        value: 4
      }
    ]
  },
  {
    label: "游戏平台",
    labelWidth: 120,
    prop: "gameplan",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "XX彩票",
        value: 1
      },
      {
        label: "AA彩票",
        value: 2
      },
      {
        label: "BB电子",
        value: 3
      },
      {
        label: "CC视讯",
        value: 4
      }
    ]
  },
  {
    label: "游戏标签",
    labelWidth: 120,
    prop: "gametag",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "热门",
        value: 1
      },
      {
        label: "推荐",
        value: 2
      }
    ]
  },
  {
    label: "最后操作人员",
    labelWidth: 120,
    prop: "operator",
    valueType: "select",
    options: [
      {
        label: "张小刚",
        value: 1
      },
      {
        label: "李小花",
        value: 2
      },
      {
        label: "王小狗",
        value: 3
      }
    ]
  },
  {
    label: "最后操作时间",
    labelWidth: 120,
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "startAt", "endAt")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      startAt: searchState.value.startAt,
      endAt: searchState.value.endAt,
      operator: searchState.value.operator,
      game: searchState.value.game,
      gameplan: searchState.value.gameplan,
      gametag: searchState.value.gametag
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

  const onAdd = () => {
    emit("add");
  };

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd
  };
};
