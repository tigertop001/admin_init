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
  operaTimeAtStart: number | null;
  operaTimeAtEnd: number | null;
  orderNo: number | string | null;
  channelName: number | string | null;
  type: number | string | null;
  currencyCode: number | string | null;
  status: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  createdAtStart: null,
  createdAtEnd: null,
  operaTimeAtStart: null,
  operaTimeAtEnd: null,
  start: 0,
  limit: 10,
  orderNo: null,
  channelName: null,
  type: null,
  currencyCode: null,
  status: null
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "createdAtStart" | "operaTimeAtStart",
  endKey: "createdAtEnd" | "operaTimeAtEnd"
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
    label: "订单号",
    prop: "orderNo",
    valueType: "input"
  },
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
    label: "提现姓名",
    prop: "orderNo",
    valueType: "input"
  },
  {
    label: "提款类型",
    width: 120,
    prop: "channelName",
    valueType: "select",
    options: [
      {
        label: "PIX",
        value: 1
      },
      {
        label: "银行卡",
        value: 2
      },
      {
        label: "数字人民币",
        value: 3
      },
      {
        label: "USDT",
        value: 4
      }
    ]
  },
  {
    label: "提款币种",
    width: 120,
    prop: "type",
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
      }
    ]
  },
  {
    label: "审核状态",
    width: 120,
    prop: "currencyCode",
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
        label: "审核通过",
        value: 2
      },
      {
        label: "复审核",
        value: 3
      },
      {
        label: "取消提现",
        value: 4
      },
      {
        label: "冻结",
        value: 4
      }
    ]
  },
  {
    label: "申请时间",
    prop: "createdTime",
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
    label: "审核时间",
    prop: "operaTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "operaTimeAtStart", "operaTimeAtEnd")
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
      operaTimeAtStart: searchState.value.operaTimeAtStart,
      operaTimeAtEnd: searchState.value.operaTimeAtEnd,
      orderNo: searchState.value.orderNo,
      channelName: searchState.value.channelName,
      type: searchState.value.type,
      currencyCode: searchState.value.currencyCode,
      status: searchState.value.status
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

  const onBatcxl = () => {
    emit("batcxl");
  };
  const onBatchk = () => {
    emit("batchk");
  };
  const onBatrej = () => {
    emit("batrej");
  };

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd,
    onBatchk,
    onBatrej,
    onBatcxl
  };
};
