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
  beginTime: number | null;
  endTime: number | null;
  revBeginTime: number | null;
  revEndTime: number | null;
  order: number | string | null;
  name: number | string | null;
  type: number | string | null;
  carr: number | string | null;
  status: number | string | null;
  orange: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  beginTime: null,
  endTime: null,
  start: 0,
  limit: 10,
  revBeginTime: null,
  revEndTime: null,
  order: null,
  name: null,
  type: null,
  carr: null,
  status: null,
  orange: null
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "beginTime" | "revBeginTime",
  endKey: "endTime" | "revEndTime"
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
    prop: "order",
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
    prop: "name",
    valueType: "input"
  },
  {
    label: "提现类型",
    prop: "type",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
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
    label: "提现币种",
    prop: "carr",
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
        value: 5
      }
    ]
  },
  {
    label: "风控原因",
    prop: "orange",
    valueType: "select",
    options: [
      {
        label: "全部",
        value: 0
      },
      {
        label: "标签1",
        value: 1
      },
      {
        label: "标签2",
        value: 2
      },
      {
        label: "标签3",
        value: 3
      },
      {
        label: "标签4",
        value: 4
      },
      {
        label: "标签5",
        value: 5
      }
    ]
  },
  {
    label: "申请时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "beginTime", "endTime")
    }
  },
  {
    label: "审核时间",
    prop: "revTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(searchState.value, val, "revBeginTime", "revEndTime")
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      beginTime: searchState.value.beginTime,
      endTime: searchState.value.endTime,
      revBeginTime: searchState.value.revBeginTime,
      revEndTime: searchState.value.revEndTime,
      order: searchState.value.order,
      name: searchState.value.name,
      type: searchState.value.type,
      carr: searchState.value.carr,
      status: searchState.value.status,
      orange: searchState.value.orange
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

  const onAdd3rd = () => {
    emit("add3rd");
  };
  const onQt3rd = () => {
    emit("qt3rd");
  };

  return {
    searchState,
    searchVal,
    columns,
    onSearch,
    onReset,
    onPrmUp,
    onAdd3rd,
    onQt3rd
  };
};
