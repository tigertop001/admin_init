import { ref } from "vue";
import type { ConditionItem } from "./types";

export interface SearchEmits {
  "update:modelValue": (param: Record<string, any>) => void;
}

export function useColumns(emit: (event: string, ...args: any[]) => void) {
  const dtLst = ref<ConditionItem[]>([]);

  const onInpChg = (value: string, row: any) => {
    dtLst.value.findIndex(item => item.id === row.id);
  };

  const onChg = () => {
    {
      const formattedData = dtLst.value.map(({ amount, ratio }) => ({
        amount: Number(amount) || 0,
        ratio: Number(ratio) || 0
      }));
      emit("update:modelValue", formattedData);
    }
  };

  const columns = [
    {
      label: "存款金额",
      prop: "amount",
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.amount}
          type="number"
          placeholder="请输入存款金额"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "奖励金额比例(%)",
      prop: "ratio",
      cellRenderer: ({ row }) => (
        <el-input
          v-model={row.ratio}
          type="number"
          placeholder="请输入比例"
          onInput={value => onInpChg(value, row)}
        />
      )
    },
    {
      label: "操作",
      fixed: "right",
      width: 70,
      slot: "operation"
    }
  ];

  function onAdd() {
    dtLst.value.push({
      id: dtLst.value.length + 1,
      amount: null,
      ratio: null
    });
    onChg();
  }

  function onDel(row: ConditionItem) {
    const index = dtLst.value.indexOf(row);
    if (index !== -1) {
      dtLst.value.splice(index, 1);
      onChg();
    }
  }

  return {
    columns,
    dtLst,
    onAdd,
    onDel,
    onChg
  };
}
