import { computed, ref } from "vue";
import type { PlusColumn } from "plus-pro-components";
import AccountTypeField from "@/components/CgDropDownSearch";
import { useDropdownRelation } from "@/views/trader/comm/pull/finance/form/columns";

interface SearchField {
  content: number | string | null;
  type: string;
  label: string;
}

interface SearchStateType {
  start: number;
  limit: number;
  account: SearchField;
  start_at: number | null;
  end_at: number | null;
  sn: string | number | null;
  sub: string | number | null;
}

export const crtDFS = (): SearchStateType => ({
  account: { content: null, type: "uid", label: "UID" },
  start_at: null,
  end_at: null,
  sn: null,
  sub: null,
  start: 0,
  limit: 10
});

const onDateChg = (
  searchState: SearchStateType,
  val: any[],
  startKey: "start_at",
  endKey: "end_at"
) => {
  if (val && Array.isArray(val)) {
    searchState[startKey] = new Date(val[0]).getTime();
    searchState[endKey] = new Date(val[1]).getTime();
  } else {
    searchState[startKey] = null;
    searchState[endKey] = null;
  }
};

export const useSearch = (emit: (event: string, ...args: any[]) => void) => {
  const searchState = ref<SearchStateType>(crtDFS());
  const { typeOptions, subOptions, curTp, curSub } = useDropdownRelation();

  const columns: PlusColumn[] = [
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
      label: "交易类型",
      labelWidth: 120,
      prop: "sn",
      valueType: "select",
      options: typeOptions,
      fieldProps: {
        modelValue: curTp,
        "onUpdate:modelValue": (val: number) => {
          curTp.value = val;
          searchState.value.sn = val;
        }
      }
    },
    {
      label: "子项",
      labelWidth: 120,
      prop: "sub",
      valueType: "select",
      options: computed(() =>
        subOptions.value.map(opt => ({
          label: `${opt.label}${opt.inOut === 1 ? "(收入)" : "(支出)"}`,
          value: opt.value
        }))
      ),
      fieldProps: {
        modelValue: curSub,
        "onUpdate:modelValue": (val: number) => {
          curSub.value = val;
          searchState.value.sub = val;
        }
      }
    },
    {
      label: "交易时间",
      prop: "regTime",
      valueType: "date-picker",
      fieldProps: {
        type: "datetimerange",
        startPlaceholder: "请选择",
        endPlaceholder: "请选择",
        onChange: (val: any) =>
          onDateChg(searchState.value, val, "start_at", "end_at")
      }
    }
  ];

  const param = computed(() => {
    const result: Record<string, any> = {
      start: searchState.value.start,
      limit: searchState.value.limit,
      start_at: searchState.value.start_at,
      end_at: searchState.value.end_at,
      sn: curTp.value,
      sub: curSub.value
    };

    const accountField = searchState.value.account;
    if (accountField.content) {
      result[accountField.type] =
        accountField.type === "uid"
          ? Number(accountField.content)
          : accountField.content;
    }

    return result;
  });

  const searchVal = computed(() => param.value);

  const onSearch = () => {
    emit("update:param", param.value);
  };

  const onReset = () => {
    searchState.value = crtDFS();
    curTp.value = null;
    curSub.value = null;
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
