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

export interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  levelUpgradeAtBeginTime: number | null;
  levelUpgradeAtEndTime: number | null;
  level: number | string | null;
}

export interface SearchEmits {
  "update:param": (param: Record<string, any>) => void;
  add: () => void;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  levelUpgradeAtBeginTime: null,
  levelUpgradeAtEndTime: null,
  level: null,
  start: 0,
  limit: 10
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "levelUpgradeAtBeginTime",
  endKey: "levelUpgradeAtEndTime"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

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
    label: "VIP等级",
    labelWidth: 150,
    prop: "level",
    valueType: "select",
    options: lvlOp.value
  },
  {
    label: "晋级时间",
    prop: "regTime",
    valueType: "date-picker",
    fieldProps: {
      type: "datetimerange",
      startPlaceholder: "请选择",
      endPlaceholder: "请选择",
      onChange: (val: any) =>
        onDateChg(
          searchState.value,
          val,
          "levelUpgradeAtBeginTime",
          "levelUpgradeAtEndTime"
        )
    }
  }
];

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      levelUpgradeAtBeginTime: searchState.value.levelUpgradeAtBeginTime,
      levelUpgradeAtEndTime: searchState.value.levelUpgradeAtEndTime,
      level: searchState.value.level
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] = accountField.content;
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

  const onAdd = () => {
    emit("add");
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
    onAdd,
    onAdd3rd,
    onQt3rd
  };
};
