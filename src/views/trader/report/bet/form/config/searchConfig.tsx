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
  createdAtStart: number | null;
  createdAtEnd: number | null;
  closeAtStart: number | null;
  closeAtEnd: number | null;
  order: number | string | null;
  gameType: number | string | null;
  gamePlat: number | string | null;
  game: number | string | null;
  state: number | string | null;
  currency: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  createdAtStart: null,
  createdAtEnd: null,
  start: 0,
  limit: 10,
  closeAtStart: null,
  closeAtEnd: null,
  order: null,
  gameType: null,
  gamePlat: null,
  game: null,
  state: null,
  currency: null
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "createdAtStart" | "closeAtStart",
  endKey: "createdAtEnd" | "closeAtEnd"
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
  },
  {
    label: "注单号",
    prop: "order",
    valueType: "input"
  },
  {
    label: "游戏类型",
    prop: "gameType",
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
        label: "电子棋牌",
        value: 2
      },
      {
        label: "视讯",
        value: 3
      }
    ]
  },
  {
    label: "游戏平台",
    prop: "gamePlat",
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
    label: "游戏",
    prop: "game",
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
    label: "状态",
    prop: "state",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "已取消",
        value: 1
      },
      {
        label: "未结算",
        value: 2
      },
      {
        label: "已结算",
        value: 3
      }
    ]
  },
  {
    label: "币种",
    prop: "currency",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "BRL",
        value: 1
      },
      {
        label: "CNY",
        value: 2
      },
      {
        label: "USD",
        value: 3
      }
    ]
  },
  {
    label: "投注时间",
    prop: "betTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "createdAtStart", "createdAtEnd")
    }
  },
  {
    label: "结算时间",
    prop: "closeTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "closeAtStart", "closeAtEnd")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      createdAtStart: searchState.value.createdAtStart,
      createdAtEnd: searchState.value.createdAtEnd,
      closeAtStart: searchState.value.closeAtStart,
      closeAtEnd: searchState.value.closeAtEnd,
      order: searchState.value.order,
      gameType: searchState.value.gameType,
      gamePlat: searchState.value.gamePlat,
      game: searchState.value.game,
      state: searchState.value.state,
      currency: searchState.value.currency
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
